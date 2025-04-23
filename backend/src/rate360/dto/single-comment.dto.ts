import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SingleCommentDto {
  @IsNumber({}, { message: 'rateId must be a valid number' })
  rateId: number;

  @IsNumber({}, { message: 'competencyId must be a valid number' })
  competencyId: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
