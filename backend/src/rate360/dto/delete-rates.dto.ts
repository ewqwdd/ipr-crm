import { IsArray, IsInt } from 'class-validator';

export class DeleteRatesDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
