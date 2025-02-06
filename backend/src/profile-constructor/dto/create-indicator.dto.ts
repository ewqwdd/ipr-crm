import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIndicatorDto {
  
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  competencyId: number;

  
}
