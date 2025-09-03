import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Recording } from '../../recordings/schemas/recording.schema';

@Schema()
export class Interview {
  @Prop({ required: false, index: true })
  title?: string;

  @Prop({ required: false, index: true })
  summary?: string;

  @Prop({ type: [String], required: false })
  categories?: string[];

  @Prop({ type: Recording })
  recording: Recording;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);

InterviewSchema.index({
  title: 'text',
  summary: 'text',
  'recording.transcriptText': 'text',
});
