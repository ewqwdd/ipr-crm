import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class SetTeamUserSpecs {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  teamId: number;

  @IsArray()
  specs: number[];
}
