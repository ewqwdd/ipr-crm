import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class RateFiltersDto {
  @IsNumber()
  @IsInt()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsInt()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['HARD', 'SOFT'])
  skill?: 'HARD' | 'SOFT';
}
