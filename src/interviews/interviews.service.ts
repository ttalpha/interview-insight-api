import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { FindInterviewsDto } from './dto/find-interviews.dto';
import { Model } from 'mongoose';
import { Interview } from './schemas/interview.schema';
import { RecordingsService } from '../recordings/recordings.service';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../files/schemas/file.schema';
import { Recording } from '../recordings/schemas/recording.schema';
import { SummarizerService } from '../summarizer/summarizer.service';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview.name) private interviewModel: Model<Interview>,
    private recordingsService: RecordingsService,
    private summarizerService: SummarizerService,
  ) {}

  async create(uploadedFiles: File[]) {
    const newRecordings = await this.recordingsService.create(uploadedFiles);
    let wholeTranscript = '';
    let index = 0;
    for (const recording of newRecordings) {
      wholeTranscript += `[TRANSCRIPT ${index + 1}]:`;
      const recordingWithTranscriptData =
        await this.recordingsService.addTranscriptData(
          uploadedFiles[index].path,
          recording._id.toString(),
        );

      wholeTranscript += recordingWithTranscriptData?.transcriptText ?? '';

      wholeTranscript += '\n\n';
      index++;
    }

    const { categories, summary, title } =
      await this.summarizerService.analyzeTranscript(wholeTranscript);

    const createdInterview = await this.interviewModel.create({
      categories,
      summary,
      title,
      recordings: newRecordings.map((r) => r._id),
    });

    return createdInterview;
  }
  async list({
    categories,
    q,
    max_dur: maxDuration,
    min_dur: minDuration,
    langs: languages,
  }: FindInterviewsDto) {
    const pipeline: any[] = [];

    // --- Root-level filters ---
    const match: any = {};
    if (categories?.length) {
      match.categories = { $in: categories };
    }
    if (q) {
      match.$text = { $search: q };
    }
    if (Object.keys(match).length) {
      pipeline.push({ $match: match });
    }

    // --- Join recordings ---
    pipeline.push({
      $lookup: {
        from: 'recordings', // collection name in MongoDB
        localField: 'recordings',
        foreignField: '_id',
        as: 'recordings',
      },
    });

    // --- Recording-level filters ---
    const recordingMatch: any = {};
    if (languages?.length) {
      recordingMatch.language = { $in: languages };
    }
    if (minDuration !== undefined || maxDuration !== undefined) {
      recordingMatch.duration = {};
      if (minDuration !== undefined) recordingMatch.duration.$gte = minDuration;
      if (maxDuration !== undefined) recordingMatch.duration.$lte = maxDuration;
    }

    if (Object.keys(recordingMatch).length) {
      pipeline.push({ $match: { recordings: { $elemMatch: recordingMatch } } });
    }

    // --- Projection (exclude heavy transcript fields) ---
    pipeline.push({
      $project: {
        title: 1,
        summary: 1,
        categories: 1,
        recordings: {
          _id: 1,
          duration: 1,
          language: 1,
          status: 1,
          file: 1,
          // explicitly exclude transcripts
        },
      },
    });

    return this.interviewModel.aggregate(pipeline);
  }

  async getDetail(
    id: string,
    recordingSelect: string = '', // default empty = all fields
  ) {
    return this.interviewModel
      .findById(id)
      .populate({ path: 'recordings', select: recordingSelect })
      .select('recordings');
  }

  async update(id: string, { categories, summary, title }: UpdateInterviewDto) {
    const dedupliatedCategories = categories
      ? Array.from(new Set(categories))
      : undefined;
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
    const deleted = await this.interviewModel
      .findByIdAndDelete(id)
      .select({ path: 'recordings', select: '_id' })
      .populate('recordings');
    if (!deleted) throw new NotFoundException();
    const toDeleteRecordings = deleted.recordings as Array<
      Recording & { _id: string }
    >;
    await this.recordingsService.remove(toDeleteRecordings.map((r) => r._id));
  }
}
