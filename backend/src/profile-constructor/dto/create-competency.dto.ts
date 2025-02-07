import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompetencyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  blockId: number;
}
