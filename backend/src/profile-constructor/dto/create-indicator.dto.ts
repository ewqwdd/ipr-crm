import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HintsDto } from './hints.dto';

export class CreateIndicatorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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
}
