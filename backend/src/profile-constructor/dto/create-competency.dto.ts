import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompetencyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  blockId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  indicators?: string[];
}
