import { Module } from '@nestjs/common';
import { SummarizerService } from './summarizer.service';

@Module({
  providers: [SummarizerService],
  exports: [SummarizerService],
})
export class SummarizerModule {}
