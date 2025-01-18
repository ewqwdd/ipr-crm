import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Length(7, 25, { message: 'Длина должна быть от 7 до 25 символов' })
  @IsString()
  password: string;
}