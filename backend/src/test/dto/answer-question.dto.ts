import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class AnswerQuestionDTO {
  @IsNumber()
  questionId: number;

  @IsOptional()
  @IsString()
  textAnswer?: string;

  @IsOptional()
  @IsNumber()
  numberAnswer?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  optionAnswer?: number[];
}
