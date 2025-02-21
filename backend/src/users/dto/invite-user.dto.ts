import { IsEmail, IsString } from 'class-validator';

export class InviteUserDTO {
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsEmail()
  email: string;
}
