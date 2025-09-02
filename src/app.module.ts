import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { InterviewsModule } from './interviews/interviews.module';
import { FilesModule } from './files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordingsModule } from './recordings/recordings.module';
import { TranscriberModule } from './transcriber/transcriber.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        OPENAI_API_KEY: Joi.string().optional(),
        UPLOAD_FILE_DEST: Joi.string().optional(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL'),
      }),
    }),
    InterviewsModule,
    FilesModule,
    RecordingsModule,
    TranscriberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
