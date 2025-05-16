import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class IprFiltersDto {
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

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  specId?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  user?: number;

  @IsOptional()
  @IsString()
  teams?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  subbordinatesOnly?: boolean;
}
