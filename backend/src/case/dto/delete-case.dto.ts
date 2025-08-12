import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCaseDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  ids: number[];
}
