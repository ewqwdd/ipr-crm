import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIndicatorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  competencyId: number;

  @IsNotEmpty()
  @IsNumber()
  boundary: number;
}
