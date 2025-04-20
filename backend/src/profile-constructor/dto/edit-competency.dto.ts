import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HintsDto } from './hints.dto';
import { ValuesDto } from './values.dto';

export class EditCompetencyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
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
