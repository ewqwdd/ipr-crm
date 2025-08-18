import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCaseRatesDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  ids: number[];
}
