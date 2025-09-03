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

  async create(uploadedFile: File) {
    const [fileMetadata] = await this.filesService.upload([uploadedFile]);
    const audioDuration = await this.getAudioDuration(uploadedFile.path);

    const recording = await this.recordingModel.create({
      duration: audioDuration,
      file: fileMetadata,
      status: RecordingProcessingStatus.Uploading,
    });
    return recording;
  }

  async addTranscriptData(filePath: string, recordingId: string) {
    try {
      const { language, rawText, segmentIds } =
        await this.transcriberService.transcribe(filePath);
      const recordingWithTranscriptAdded =
        await this.recordingModel.findByIdAndUpdate(
          recordingId,
          {
            status: RecordingProcessingStatus.Transcribing,
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

  async remove(recordingId: string) {
    const recordingWithFileAndSegments = await this.recordingModel
      .findByIdAndDelete(recordingId)
      .populate('transcript')
      .populate('file');

    if (!recordingWithFileAndSegments) throw new NotFoundException();
    const transcriptSegments = recordingWithFileAndSegments.transcript as Array<
      TranscriptSegment & { _id: string }
    >;
    await this.transcriberService.removeTranscriptSegments(
      transcriptSegments.map((t) => t._id),
    );
    const recordingFile = recordingWithFileAndSegments.file as File & {
      _id: string;
    };
    return this.filesService.remove([recordingFile._id]);
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
