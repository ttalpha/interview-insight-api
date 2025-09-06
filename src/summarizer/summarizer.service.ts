import { BadRequestException, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './constants/prompt';
import { zodResponseFormat } from 'openai/helpers/zod';
import { Summary } from './schemas/summary.schema';

@Injectable()
export class SummarizerService implements OnModuleInit {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async analyzeTranscript(transcript: string) {
    if (!transcript.trim())
      return {
        categories: [],
        title: null,
        summary: null,
      };
    const completion = await this.openai.chat.completions.parse({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript },
      ],
      response_format: zodResponseFormat(Summary, 'summary'),
    });
    const summary = completion.choices[0].message;
    if (summary.refusal) throw new BadRequestException(summary.refusal);
    return summary.parsed!;
  }
}
