import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class File {
  @Prop({ required: true })
  filename: string;

  @Prop({ unique: true, required: true })
  path: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
