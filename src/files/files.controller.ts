import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { type Response } from 'express';
import { createReadStream } from 'fs';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(':id')
  async streamFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.filesService.findMetadataById(id);
    if (!file) throw new NotFoundException();
    const stream = createReadStream(file.path);
    res.set({
      'Content-Disposition': `inline; filename=${file.filename}`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }
}
