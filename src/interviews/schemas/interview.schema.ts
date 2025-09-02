import * as mongoose from 'mongoose';
import { TranscriptSegmentSchema } from './transcript-segment.schema';
import { InterviewProcessingStatus } from '../types';

export const InterviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mimetype: { type: String, required: true },
    fileUrl: { type: String, required: true },
    duration: { type: Number }, // in seconds
    language: { type: String, default: 'en' },
    transcript: [TranscriptSegmentSchema],
    anonymizedTranscript: [TranscriptSegmentSchema],
    summary: { type: String },
    categories: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(InterviewProcessingStatus),
      default: InterviewProcessingStatus.Pending,
    },
    error: { type: String },
  },
  { timestamps: true },
);
