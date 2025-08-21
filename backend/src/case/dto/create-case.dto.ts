import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCaseVariantDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;
}

export class CreateCaseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  commentEnabled?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCaseVariantDto)
  variants?: CreateCaseVariantDto[];
}
