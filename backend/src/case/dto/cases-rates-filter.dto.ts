import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CasesRatesFilterDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  case?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
