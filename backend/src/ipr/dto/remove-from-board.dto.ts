import { IsNumber } from 'class-validator';

export class RemoveFromBoardDto {
  @IsNumber()
  id: number;
}
