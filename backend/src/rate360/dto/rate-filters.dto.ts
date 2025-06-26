import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsNumberString,
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
  @IsEnum(['COMPLETED', 'NOT_COMPLETED', 'NOT_CONFIRMED'])
  status?: 'COMPLETED' | 'NOT_COMPLETED' | 'NOT_CONFIRMED';

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  specId?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  user?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  product?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  department?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  direction?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  group?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hidden?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  subbordinatesOnly?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeWhereEvaluatorCurator?: boolean;
}
