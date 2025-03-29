import { IsArray, IsDateString, IsInt, IsOptional } from 'class-validator';

export class AssignUsersDTO {
  @IsArray()
  @IsInt({ each: true })
  userIds: number[];

  @IsOptional()
  @IsDateString()
  startDate?: string;
}
