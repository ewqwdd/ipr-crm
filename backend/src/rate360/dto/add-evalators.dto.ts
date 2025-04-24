import { IsArray, IsInt } from 'class-validator';

export class AddEvaluatorsDto {
  @IsArray()
  @IsInt({ each: true })
  evaluateCurators: number[];

  @IsArray()
  @IsInt({ each: true })
  evaluateSubbordinate: number[];

  @IsArray()
  @IsInt({ each: true })
  evaluateTeam: number[];
}
