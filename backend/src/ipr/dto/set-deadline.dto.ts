import { IsDateString, IsNumber } from 'class-validator';

export class SetDeadlineDto {
  @IsNumber()
  id: number;

  @IsDateString()
  deadline: string;
}
