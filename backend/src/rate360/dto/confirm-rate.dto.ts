import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EvaluateUserDto {
  @IsInt()
  userId: number;

  @IsString()
  username: string;
}

export class ConfirmRateDto {
  @IsInt()
  rateId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluateUserDto)
  evaluateCurators: EvaluateUserDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluateUserDto)
  evaluateSubbordinate: EvaluateUserDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluateUserDto)
  evaluateTeam: EvaluateUserDto[];

  @IsString()
  @IsOptional()
  comment?: string;
}
