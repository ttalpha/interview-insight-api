import { Injectable, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { TranscriptSegment } from './schemas/transcript-segment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TranscriberService implements OnModuleInit {
  private openai: OpenAI;
  constructor(
    private configService: ConfigService,
    @InjectModel(TranscriptSegment.name)
    private transcriptSegmentModel: Model<TranscriptSegment>,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  async removeTranscriptSegments(segmentIds: string[]) {
    await this.transcriptSegmentModel.deleteMany({
      _id: { $in: segmentIds },
    });
  }

  async transcribe(filePath: string) {
    const stream = createReadStream(filePath);
    const transcription = await this.openai.audio.transcriptions.create({
      file: stream,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    });
    const segments = (transcription.segments ?? []).map((w) => ({
      start: w.start,
      end: w.end,
      text: w.text,
    }));
    const inserted = await this.transcriptSegmentModel.create(segments);
    return {
      language: transcription.language,
      rawText: transcription.text,
      segmentIds: inserted.map((i) => i._id),
    };
  }
}
