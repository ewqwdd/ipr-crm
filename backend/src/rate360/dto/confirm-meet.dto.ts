import { Transform } from 'class-transformer';

export class ConfirmMeetDto {
  @Transform(({ value }) => new Date(value))
  date: Date;
}
