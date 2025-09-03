import { Transform } from 'class-transformer';
import { IsArray, IsOptional, Length, Min } from 'class-validator';

export class FindInterviewsDto {
  @IsOptional()
  @Length(1, 60)
  q?: string;

  @Transform(({ value }: { value: string }) => value.split(','))
  @IsOptional()
  @IsArray()
  @Length(1, 60, { each: true })
  categories?: string[];

  @Transform(({ value }: { value: string }) => value.split(','))
  @IsOptional()
  @IsArray()
  @Length(1, 60, { each: true })
  languages?: string[];

  @IsOptional()
  @Min(1)
  minDuration?: number;

  @IsOptional()
  @Min(1)
  maxDuration?: number;
}
