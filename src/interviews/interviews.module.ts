import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordingsModule } from '../recordings/recordings.module';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { Interview, InterviewSchema } from './schemas/interview.schema';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { RECORDING_ALLOWED_MIMETYPES, RECORDING_MAX_BYTES } from '../constants';
import { SummarizerModule } from '../summarizer/summarizer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interview.name, schema: InterviewSchema },
    ]),
    SummarizerModule,
    RecordingsModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('UPLOAD_FILE_DEST')!,
          filename: (req, file, callback) => {
            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext);
            const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_'); // replace unsafe chars
            callback(null, `${Date.now()}-${safeName}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!RECORDING_ALLOWED_MIMETYPES.includes(file.mimetype))
            return callback(new Error('Invalid file type'), false);
          if (file.size >= RECORDING_MAX_BYTES)
            return callback(new Error('File size is too large'), false);
          return callback(null, true);
        },
      }),
    }),
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
