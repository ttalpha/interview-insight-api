export const InterviewModelName = 'Interview';
export const TranscriptSegmentModelName = 'TranscriptSegment';
export const RecordingModelName = 'Recording';
export const RECORDING_ALLOWED_MIMETYPES: readonly string[] = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/mp4',
  'audio/aiff',
  'audio/flac',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-flv',
  'video/mp2t',
  'video/mpeg',
];
export const RECORDING_MAX_BYTES = 25 * Math.pow(1024, 2); // in bytes
