import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RateFiltersDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['HARD', 'SOFT'])
  skill?: 'HARD' | 'SOFT';

  @IsString()
  @IsOptional()
  @IsEnum(['COMPLETED', 'NOT_COMPLETED'])
  status?: 'COMPLETED' | 'NOT_COMPLETED';

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  specId?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  user?: number;

  @IsOptional()
  @IsInt({ each: true })
  teams?: number[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
