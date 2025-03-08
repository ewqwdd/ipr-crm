import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class SetTeamUserSpecs {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  teamId: number;

  @IsArray()
  specs: number[];

  @IsBoolean()
  @IsOptional()
  curator: boolean;
}
