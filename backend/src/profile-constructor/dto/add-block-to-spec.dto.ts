import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddBlockToSpecDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  blockIds: number[];

  @IsNumber()
  specId: number;
}
