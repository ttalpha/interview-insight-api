import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RecordingModelName } from '../../constants';
import { Recording } from '../../recordings/schemas/recording.schema';

@Schema()
export class Interview {
  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  summary?: string;

  @Prop({ type: [String], required: false })
  categories?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: RecordingModelName })
  recording: Recording;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
