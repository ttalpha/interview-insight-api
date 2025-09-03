import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FindInterviewsDto } from './dto/find-interviews.dto';
import { Model } from 'mongoose';
import { Interview } from './schemas/interview.schema';
import { RecordingsService } from '../recordings/recordings.service';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../files/schemas/file.schema';
import { Recording } from '../recordings/schemas/recording.schema';

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
    const dedupliatedCategories = Array.from(new Set(categories || []));
    const newRecording = await this.recordingsService.create(uploaded);
    const recordingWithTranscriptData =
      await this.recordingsService.addTranscriptData(
        uploaded.path,
        newRecording._id.toString(),
      );
    const createdInterview = await this.interviewModel.create({
      categories: dedupliatedCategories,
      summary,
      title,
      recording: recordingWithTranscriptData,
    });
    return createdInterview;
  }

  async list({
    categories,
    q,
    maxDuration,
    minDuration,
    languages,
  }: FindInterviewsDto) {
    const filter: any = {};

    if (categories?.length) {
      filter.categories = { $in: categories };
    }

    if (languages?.length) {
      filter['recording.language'] = { $in: languages };
    }

    if (q) {
      filter.$text = { $search: q };
    }

    if (minDuration !== undefined || maxDuration !== undefined) {
      filter['recording.duration'] = {};
      if (minDuration !== undefined)
        filter['recording.duration'].$gte = minDuration;
      if (maxDuration !== undefined)
        filter['recording.duration'].$lte = maxDuration;
    }

    return this.interviewModel
      .find(filter)
      .select('-recording.transcript -recording.transcriptText');
  }

  getProcessingStatus(id: string) {
    return this.interviewModel.findById(id).select('recording.status');
  }

  getDetail(id: string) {
    return this.interviewModel.findById(id).populate('recording.transcript');
  }

  async update(id: string, { categories, summary, title }: UpdateInterviewDto) {
    const dedupliatedCategories = Array.from(new Set(categories || []));
    const updated = await this.interviewModel.findByIdAndUpdate(
      id,
      {
        categories: dedupliatedCategories,
        title,
        summary,
      },
      { new: true },
    );
    if (!updated) throw new NotFoundException();
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.interviewModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException();
    const toDeleteRecording = deleted.recording as Recording & { _id: string };
    await this.recordingsService.remove(toDeleteRecording._id);
  }
}
