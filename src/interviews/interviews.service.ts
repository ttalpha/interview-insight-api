import { Injectable } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FindInterviewsDto } from './dto/find-interviews.dto';

@Injectable()
export class InterviewsService {
  create(createInterviewDto: CreateInterviewDto) {
    return 'This action adds a new interview';
  }

  list(findInterviewsDto: FindInterviewsDto) {
    return `This action returns all interviews`;
  }

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
