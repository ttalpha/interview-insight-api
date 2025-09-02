import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import ffmpeg from 'fluent-ffmpeg';
import { Recording } from './schemas/recording.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../files/schemas/file.schema';
import { TranscriberService } from '../transcriber/transcriber.service';

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
    const { language, segmentIds } = await this.transcriberService.transcribe(
      uploadedFile.path,
    );

    const recording = await this.recordingModel.create({
      duration: audioDuration,
      file: fileMetadata,
      language,
      transcript: segmentIds,
    });
    return recording._id;
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
