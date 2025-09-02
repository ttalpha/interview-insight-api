import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from '../files/files.module';
import { TranscriberModule } from '../transcriber/transcriber.module';
import { RecordingsService } from './recordings.service';
import { Recording, RecordingSchema } from './schemas/recording.schema';

@Module({
  imports: [
    FilesModule,
    TranscriberModule,
    MongooseModule.forFeature([
      { name: Recording.name, schema: RecordingSchema },
    ]),
  ],
  providers: [RecordingsService],
  exports: [RecordingsService],
})
export class RecordingsModule {}
