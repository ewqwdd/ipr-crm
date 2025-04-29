import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditMaterialDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsEnum(['VIDEO', 'BOOK', 'COURSE', 'ARTICLE', 'TASK'])
  contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE' | 'TASK';

  @IsOptional()
  @IsString()
  url?: string;

  @IsNumber()
  level: number;
}
