import { IsArray, IsOptional, Length } from 'class-validator';

export class FindInterviewsDto {
  @IsOptional()
  @Length(1, 60)
  q?: string;

  @IsOptional()
  @IsArray()
  @Length(1, 60, { each: true })
  categories?: string[];
}
