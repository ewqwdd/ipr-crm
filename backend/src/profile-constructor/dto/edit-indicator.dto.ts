import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HintsDto } from './hints.dto';
import { Type } from 'class-transformer';
import { ValuesDto } from './values.dto';

export class EditIndicatorDto {
  @IsString()
  name: string;

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
