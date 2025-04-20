import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HintsDto } from './hints.dto';
import { ValuesDto } from './values.dto';

export class CreateIndicatorDto {
  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  indicators: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  competencyId: number;

  @IsNotEmpty()
  @IsNumber()
  boundary: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => HintsDto)
  hints?: HintsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ValuesDto)
  values?: ValuesDto;
}
