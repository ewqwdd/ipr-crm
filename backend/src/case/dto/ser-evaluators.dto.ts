import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class SetEvaluatorsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  evaluators: number[];

  @IsNumber()
  @Type(() => Number)
  rateId: number;
}
