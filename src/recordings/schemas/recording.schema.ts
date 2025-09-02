import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FileModelName } from '../../files/constants';
import { TranscriptSegmentModelName } from '../../constants';
import { TranscriptSegment } from '../../transcriber/schemas/transcript-segment.schema';
import { InterviewProcessingStatus } from '../../interviews/types';

@Schema()
export class Recording {
  @Prop()
  duration: number;

  @Prop()
  language: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileModelName })
  file: File;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: TranscriptSegmentModelName },
    ],
  })
  transcript: TranscriptSegment[];

  @Prop({
    default: InterviewProcessingStatus.Pending,
    enum: Object.values(InterviewProcessingStatus),
  })
  status: InterviewProcessingStatus;
}

export const RecordingSchema = SchemaFactory.createForClass(Recording);
