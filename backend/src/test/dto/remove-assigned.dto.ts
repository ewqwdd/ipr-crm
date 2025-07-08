import { IsInt } from 'class-validator';

export class RemoveAssignedDTO {
  @IsInt()
  userId: number;
}
