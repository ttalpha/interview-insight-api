import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FindInterviewsDto } from './dto/find-interviews.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('recording'))
  create(
    @Body() createInterviewDto: CreateInterviewDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.interviewsService.create(createInterviewDto, {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  @Get()
  list(@Query() findInterviewsDto: FindInterviewsDto) {
    return this.interviewsService.list(findInterviewsDto);
  }

  @Get(':id/status')
  getProcessingStatus(@Param('id') id: string) {
    return this.interviewsService.getProcessingStatus(id);
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.interviewsService.getDetail(id);
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
