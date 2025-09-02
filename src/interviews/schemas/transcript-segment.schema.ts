import * as mongoose from 'mongoose';

export const TranscriptSegmentSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  text: { type: String, required: true },
});
