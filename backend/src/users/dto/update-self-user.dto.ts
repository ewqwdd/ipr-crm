import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSelfUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  firstName: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}
