import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TranscriptSegment {
  @Prop()
  start: number;

  @Prop()
  end: number;

  @Prop()
  text: string;
}

export const TranscriptSegmentSchema =
  SchemaFactory.createForClass(TranscriptSegment);
