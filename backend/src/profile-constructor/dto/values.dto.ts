import { IsOptional, IsString } from 'class-validator';

export class ValuesDto {
  @IsOptional()
  @IsString()
  0?: string;

  @IsOptional()
  @IsString()
  1?: string;

  @IsOptional()
  @IsString()
  2?: string;

  @IsOptional()
  @IsString()
  3?: string;

  @IsOptional()
  @IsString()
  4?: string;

  @IsOptional()
  @IsString()
  5?: string;
}
