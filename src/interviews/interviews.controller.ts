import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FindInterviewsDto } from './dto/find-interviews.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('recordings'))
  async create(@UploadedFiles() files: Express.Multer.File[]) {
    const newInterview = await this.interviewsService.create(
      files.map((file) => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      })),
    );
    return newInterview;
  }

  @Get()
  async list(@Query() findInterviewsDto: FindInterviewsDto) {
    const interviews = await this.interviewsService.list(findInterviewsDto);
    return interviews;
  }

  @Get(':id/status')
  async getProcessingStatus(@Param('id') id: string) {
    const data = await this.interviewsService.getDetail(id, 'status');
    return data?.recordings;
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.interviewsService.getDetail(id, '-transcript');
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewsService.update(id, updateInterviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewsService.remove(id);
  }
}
