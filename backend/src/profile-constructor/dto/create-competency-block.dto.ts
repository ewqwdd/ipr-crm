import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompetencyBlockDto {
  
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['SOFT', 'HARD'])
  type: 'SOFT' | 'HARD';

  @IsNumber()
  specId: number;
}
