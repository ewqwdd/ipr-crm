import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createMaterialCompetencyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsEnum(['VIDEO', 'BOOK', 'COURSE', 'ARTICLE'])
  contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';

  @IsOptional()
  @IsString()
  url?: string;

  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsNumber()
  competencyId: number;
}
