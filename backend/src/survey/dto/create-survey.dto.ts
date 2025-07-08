import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsInt,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SurveyType, TestAccess } from '@prisma/client';

class OptionDTO {
  @IsOptional()
  @IsNumber()
  @IsInt()
  id?: number;

  @IsString()
  value: string;
}

class QuestionDTO {
  @IsNumber()
  @IsOptional()
  @IsInt()
  id?: number;

  @IsEnum(SurveyType)
  type: SurveyType;

  @IsString()
  label: string;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsBoolean()
  allowDecimal?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  maxNumber?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  minNumber?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  scaleDots?: number;

  @IsOptional()
  @IsString()
  scaleStart?: string;

  @IsOptional()
  @IsString()
  scaleEnd?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDTO)
  options?: OptionDTO[];
}

export class CreateSurveyDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  passedMessage?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'LINK_ONLY'])
  access?: TestAccess;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsString()
  failedMessage?: string;

  @IsOptional()
  @IsString()
  finishMessage?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  surveyQuestions: QuestionDTO[];
}
