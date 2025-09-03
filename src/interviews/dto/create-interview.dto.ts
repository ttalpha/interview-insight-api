import { IsArray, IsOptional, Length, Matches } from 'class-validator';

export class CreateInterviewDto {
  @IsOptional()
  @Length(1, 120)
  title?: string;

  @IsOptional()
  @Length(1, 1000)
  summary?: string;

  @IsOptional()
  @IsArray()
  @Matches(/[^,]+/, { each: true, message: 'Category cannot contain commas' })
  @Length(1, 60, { each: true })
  categories?: string[];
}
