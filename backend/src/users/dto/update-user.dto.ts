import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  phone?: string;
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
  avatar?: string;
}