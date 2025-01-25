import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
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
  @Transform(({ value }) => Number(value))
  roleId: number;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  specId: number;
  avatar?: string;
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  teams?: number[];
}
