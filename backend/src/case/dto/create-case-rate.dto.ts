import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateCaseRateDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  users: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  cases: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  evaluators: number[];

  @IsBoolean()
  @IsOptional()
  globalCommentsEnabled?: boolean;
}
