import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  direction?: string;

  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsBoolean()
  leader?: boolean;
}

export class CreateMultipleUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
