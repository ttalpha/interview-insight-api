import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from '../files/files.module';
import { TranscriberModule } from '../transcriber/transcriber.module';
import { RecordingsService } from './recordings.service';
import { Recording, RecordingSchema } from './schemas/recording.schema';
import { RecordingsController } from './recordings.controller';

@Module({
  imports: [
    FilesModule,
    TranscriberModule,
    MongooseModule.forFeature([
      { name: Recording.name, schema: RecordingSchema },
    ]),
  ],
  controllers: [RecordingsController],
  providers: [RecordingsService],
  exports: [RecordingsService],
})
export class RecordingsModule {}
