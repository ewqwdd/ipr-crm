import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

type SkillType = 'SOFT' | 'HARD';

class EvaluateUserDto {
  @IsInt()
  userId: number;

  @IsString()
  username: string;
}

class SpecDto {
  @IsInt()
  specId: number;

  @IsInt()
  userId: number;

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
}

class TeamDto {
  @IsInt()
  teamId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecDto)
  specs: SpecDto[];
}

export class CreateRateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamDto)
  rate: TeamDto[];

  @IsArray()
  @IsEnum(['SOFT', 'HARD'], { each: true })
  skill: SkillType[];

  @IsBoolean()
  confirmUser: boolean;

  @IsBoolean()
  confirmCurator: boolean;
}
