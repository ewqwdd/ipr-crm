import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createMaterialIndicatorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(['VIDEO', 'BOOK', 'COURSE', 'ARTICLE'])
  contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';

  @IsString()
  url?: string;

  @IsNotEmpty()
  @IsNumber()
  indicatorId: number;
}
