import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteIprsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  ids: number[];
}
