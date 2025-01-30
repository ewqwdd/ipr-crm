import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AddTeamUserDto {
  @IsNotEmpty()
  @IsArray()
  userIds: number[];

  @IsNotEmpty()
  @IsNumber()
  teamId: number;
}
