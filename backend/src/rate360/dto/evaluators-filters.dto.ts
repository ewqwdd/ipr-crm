import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
export class EvaluatorsFiltersDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number;

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
}
