import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class TransferToDto {
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
