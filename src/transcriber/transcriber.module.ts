import { Module } from '@nestjs/common';
import { TranscriberService } from './transcriber.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TranscriptSegment,
  TranscriptSegmentSchema,
} from './schemas/transcript-segment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TranscriptSegment.name, schema: TranscriptSegmentSchema },
    ]),
  ],
  providers: [TranscriberService],
  exports: [TranscriberService],
})
export class TranscriberModule {}
