import { IsString } from 'class-validator';

export class SetGoalDto {
  @IsString()
  goal: string;
}
