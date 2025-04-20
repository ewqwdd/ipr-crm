import { Type } from 'class-transformer';
import {
  IsArray,
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
  team: string;

  @IsOptional()
  @IsString()
  spec: string;
}

export class CreateMultipleUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
