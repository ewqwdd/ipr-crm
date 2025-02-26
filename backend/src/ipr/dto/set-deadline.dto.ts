import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class SetDeadlineDto {
  @IsNumber()
  id: number;

  @IsDateString()
  @IsOptional()
  deadline: string;
}
