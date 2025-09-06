import { z } from 'zod';
import { InterviewCategory } from '../types';

export const Summary = z.object({
  title: z.string(),
  summary: z.string(),
  categories: z
    .enum(Object.values(InterviewCategory) as [string, ...string[]])
    .array(),
});
