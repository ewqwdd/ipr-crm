import { IsNumber } from 'class-validator';

export class SetDeputyDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  deputyId: number;
}
