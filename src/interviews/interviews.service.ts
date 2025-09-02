import { Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FindInterviewsDto } from './dto/find-interviews.dto';
import { Model } from 'mongoose';
import { Interview } from './schemas/interview.schema';
import { RecordingsService } from '../recordings/recordings.service';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../files/schemas/file.schema';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview.name) private interviewModel: Model<Interview>,
    private recordingsService: RecordingsService,
  ) {}

  async create(
    { categories, summary, title }: CreateInterviewDto,
    uploaded: File,
  ) {
    const newRecordingId = await this.recordingsService.create(uploaded);
    const createdInterview = await this.interviewModel.create({
      categories,
      summary,
      title,
      recording: newRecordingId,
    });
    return createdInterview;
  }

  list(findInterviewsDto: FindInterviewsDto) {
    return `This action returns all interviews`;
  }

  getRecordingMetadata(id: string) {}

  getProcessingStatus(id: string) {}

  getDetail(id: string) {
    return `This action returns a #${id} interview`;
  }

  update(id: string, updateInterviewDto: UpdateInterviewDto) {
    return `This action updates a #${id} interview`;
  }

  remove(id: string) {
    return `This action removes a #${id} interview`;
  }
}
