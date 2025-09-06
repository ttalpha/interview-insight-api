import { Controller, Get, Param, Post } from '@nestjs/common';
import { RecordingsService } from './recordings.service';

@Controller('recordings')
export class RecordingsController {
  constructor(private recordingsService: RecordingsService) {}

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const recording = await this.recordingsService.getDetail(id);
    return recording;
  }
}
