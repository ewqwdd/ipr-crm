import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsInt,
  IsNumberString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TestAccess } from '@prisma/client';

class OptionDTO {
  @IsOptional()
  @IsNumber()
  @IsInt()
  id?: number;

  @IsString()
  value: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}

enum QuestionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
}

class QuestionDTO {
  @IsNumber()
  @IsOptional()
  @IsInt()
  id?: number;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  label: string;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  numberCorrectValue?: number;

  @IsOptional()
  @IsString()
  textCorrectValue?: string;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDTO)
  options?: OptionDTO[];
}

export class CreateTestDTO {
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
  @IsBoolean()
  limitedByTime?: boolean;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'LINK_ONLY'])
  access?: TestAccess;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  minimumScore?: number;

  @IsOptional()
  @IsBoolean()
  showScoreToUser?: boolean;

  @IsOptional()
  @IsString()
  failedMessage?: string;

  @IsOptional()
  @IsString()
  finishMessage?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];
}
