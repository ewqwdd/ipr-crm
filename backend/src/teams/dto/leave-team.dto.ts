import { IsNotEmpty, IsNumber } from 'class-validator';

export class LeaveTeamDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  teamId: number;
}
