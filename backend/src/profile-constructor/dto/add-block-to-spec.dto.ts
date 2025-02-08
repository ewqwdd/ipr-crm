import { IsNumber } from 'class-validator';

export class AddBlockToSpecDto {
  @IsNumber()
  blockIds: number[];

  @IsNumber()
  specId: number;
}
