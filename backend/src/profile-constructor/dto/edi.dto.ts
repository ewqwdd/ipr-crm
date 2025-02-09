import { IsString } from 'class-validator';

export class EditDto {
  @IsString()
  name: string;
}
