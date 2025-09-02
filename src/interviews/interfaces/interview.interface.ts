import { Document } from 'mongoose';
import { InterviewProcessingStatus } from '../types';

export interface Interview extends Document {
  readonly title: string;
  readonly mimetype: string;
  readonly filePath: string;
  readonly filename: string;
  readonly duration: number;
  readonly language: string;
  readonly transcript: TranscriptSegment[];
  readonly anonymizedTranscript: TranscriptSegment[];
  readonly summary: string;
  readonly categories: string[];
  readonly status: InterviewProcessingStatus;
  readonly error?: string;
}

export interface TranscriptSegment {
  readonly text: string;
  readonly start: number;
  readonly end: number;
}
