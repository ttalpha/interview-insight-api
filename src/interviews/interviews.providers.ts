import { Connection } from 'mongoose';
import { InterviewSchema } from './schemas/interview.schema';
import { Provider } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/constants';
import { INTERVIEW_MODEL, INTERVIEW } from './constants';

export const interviewsProviders: Provider[] = [
  {
    provide: INTERVIEW_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(INTERVIEW, InterviewSchema),
    inject: [DATABASE_CONNECTION],
  },
];
