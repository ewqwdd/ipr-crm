import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompetencyBlockDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['SOFT', 'HARD'])
  type: 'SOFT' | 'HARD';

  @IsOptional()
  @IsNumber()
  specId?: number;
}
