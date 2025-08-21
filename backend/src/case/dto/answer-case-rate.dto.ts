import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CaseRateItemDto {
  @IsNumber()
  caseId: number;

  @IsNumber()
  rate: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class AnswerCaseRateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaseRateItemDto)
  rates: CaseRateItemDto[];

  @IsOptional()
  @IsString()
  globalComment?: string;
}
