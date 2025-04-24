import { IsArray, IsInt } from 'class-validator';

export class DeleteEvaluatorsDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
