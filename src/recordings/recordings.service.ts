import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';
import ffmpeg from 'fluent-ffmpeg';
import { Recording } from './schemas/recording.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../files/schemas/file.schema';
import { TranscriberService } from '../transcriber/transcriber.service';
import { RecordingProcessingStatus } from './types';
import { TranscriptSegment } from '../transcriber/schemas/transcript-segment.schema';

@Injectable()
export class RecordingsService {
  constructor(
    private filesService: FilesService,
    @InjectModel(Recording.name) private recordingModel: Model<Recording>,
    private transcriberService: TranscriberService,
  ) {}

  async create(uploadedFiles: File[]) {
    const filesMetadata = await this.filesService.upload(uploadedFiles);

    const audioDurations = await Promise.all(
      uploadedFiles.map((file) => this.getAudioDuration(file.path)),
    );

    const recordingDocs = filesMetadata.map((metadata, index) => ({
      duration: audioDurations[index],
      file: metadata,
      status: RecordingProcessingStatus.Pending,
    }));

    const recordings = await this.recordingModel.create(recordingDocs);

    return recordings;
  }

  async addTranscriptData(filePath: string, recordingId: string) {
    try {
      await this.updateStatus(
        recordingId,
        RecordingProcessingStatus.Processing,
      );

      const { language, rawText, segmentIds } =
        await this.transcriberService.transcribe(filePath);

      const recordingWithTranscriptAdded =
        await this.recordingModel.findByIdAndUpdate(
          recordingId,
          {
            status: RecordingProcessingStatus.Done,
            language,
            transcriptText: rawText,
            transcript: segmentIds,
          },
          { new: true },
        );
      return recordingWithTranscriptAdded;
    } catch (error) {
      await this.updateStatus(
        recordingId,
        RecordingProcessingStatus.Failed,
        error.message,
      );
      throw new InternalServerErrorException();
    }
  }

  private async updateStatus(
    id: string,
    newStatus: RecordingProcessingStatus,
    error?: string,
  ) {
    const interviewWithUpdatedStatus = await this.recordingModel
      .findByIdAndUpdate(id, { status: newStatus, error }, { new: true })
      .select('status error');
    return interviewWithUpdatedStatus;
  }

  async remove(recordingIds: string[]) {
    const recordingsWithFileAndTranscript = await this.recordingModel
      .find({ _id: { $in: recordingIds } })
      .populate({ path: 'file', select: 'path' }) // ✅ proper populate
      .populate({ path: 'transcript', select: '_id' }) // ✅ transcript IDs
      .select('file transcript'); // ✅ only keep what you need

    await this.recordingModel.deleteMany({ _id: { $in: recordingIds } });

    const transcriptSegments = recordingsWithFileAndTranscript.flatMap((r) =>
      r.transcript.map((t: TranscriptSegment & { _id: string }) => t._id),
    );

    const filePaths = recordingsWithFileAndTranscript.map((r) => r.file?.path);

    await this.transcriberService.removeTranscriptSegments(transcriptSegments);
    return this.filesService.remove(filePaths);
  }

  async getDetail(id: string) {
    const recording = await this.recordingModel
      .findById(id)
      .populate('transcript');
    if (!recording) throw new NotFoundException();
    return recording;
  }

  private getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          return reject(err);
        }
        resolve(metadata.format.duration || 0);
      });
    });
  }
}
