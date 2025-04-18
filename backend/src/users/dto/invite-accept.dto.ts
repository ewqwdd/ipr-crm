import { IsString, Length } from 'class-validator';

export class InviteAcceptDTO {
  @IsString()
  code: string;
  @IsString()
  @Length(7, 25, { message: 'Длина должна быть от 7 до 25 символов' })
  password: string;
}
