import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsString,  } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  password?: string;
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
  @Transform(({ value }) => Number(value))
  roleId: number;
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  specId: number;
  avatar?: string;
}