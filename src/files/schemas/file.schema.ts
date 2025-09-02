import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class File {
  @Prop()
  filename: string;

  @Prop()
  path: string;

  @Prop()
  mimetype: string;

  @Prop()
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
