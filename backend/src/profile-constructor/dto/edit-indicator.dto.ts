import { IsNumber, IsString } from 'class-validator';

export class EditIndicatorDto {
  @IsString()
  name: string;

  @IsNumber()
  boundary: number;
}
