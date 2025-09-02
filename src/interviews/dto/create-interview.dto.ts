import { IsArray, IsOptional, Length } from 'class-validator';

export class CreateInterviewDto {
  @IsOptional()
  @Length(1, 120)
  title?: string;

  @IsOptional()
  @Length(1, 1000)
  summary?: string;

  @IsOptional()
  @IsArray()
  @Length(1, 60, { each: true })
  categories?: string[];
}
