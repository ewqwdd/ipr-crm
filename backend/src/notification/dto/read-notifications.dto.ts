import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ReadNotificationsDto {
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
