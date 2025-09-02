import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FindInterviewsDto } from './dto/find-interviews.dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.create(createInterviewDto);
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
