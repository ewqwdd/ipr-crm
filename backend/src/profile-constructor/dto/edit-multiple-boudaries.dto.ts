import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { HintsDto } from './hints.dto';
import { Type } from 'class-transformer';

export class EditMultipleBoundariesDto {
  @IsNumber()
  boundary: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => HintsDto)
  hints?: HintsDto;
}
