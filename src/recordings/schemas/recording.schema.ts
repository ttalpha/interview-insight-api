import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FileModelName } from '../../files/constants';
import { File } from '../../files/schemas/file.schema';
import { TranscriptSegment } from '../../transcriber/schemas/transcript-segment.schema';
import { RecordingProcessingStatus } from '../types';
import { TranscriptSegmentModelName } from '../../constants';

@Schema()
export class Recording {
  @Prop({ required: false })
  duration?: number;

  @Prop({ required: false })
  language?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileModelName })
  file: File;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: TranscriptSegmentModelName },
    ],
  })
  transcript: TranscriptSegment[];

  @Prop({ required: false })
  transcriptText?: string;

  @Prop({
    default: RecordingProcessingStatus.Uploading,
    enum: Object.values(RecordingProcessingStatus),
  })
  status: RecordingProcessingStatus;

  @Prop({ required: false })
  error?: string;
}

export const RecordingSchema = SchemaFactory.createForClass(Recording);
