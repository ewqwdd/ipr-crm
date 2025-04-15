import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
  IsPhoneNumber,
} from 'class-validator';

export class AnswerQuestionDTO {
  @Type(() => Number)
  @IsNumber()
  questionId: number;

  @IsOptional()
  @IsString()
  textAnswer?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  numberAnswer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  scaleAnswer?: number;

  @IsOptional()
  @IsString()
  dateAnswer?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneAnswer?: string;

  @IsOptional()
  @IsString()
  timeAnswer?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number) // 👈 обязательно!
  optionAnswer?: number[];
}
