import {
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsNotEmpty,
} from 'class-validator';

class UserAssessmentDto {
  @IsNumber({}, { message: 'rate must be a valid number' })
  rate: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class RatingsDto {
  @IsNumber({}, { message: 'rateId must be a valid number' })
  @IsNotEmpty()
  rateId: number;

  @IsObject()
  ratings: Record<string, UserAssessmentDto>;

  @IsObject()
  comments: Record<number, string>;
}
