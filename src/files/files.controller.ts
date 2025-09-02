import { Controller, Get } from '@nestjs/common';

@Controller('files')
export class FilesController {
  @Get(':id')
  streamFile() {}
}
