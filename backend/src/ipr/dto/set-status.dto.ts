import { TaskStatus } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class SetStatusDto {
  @IsEnum(['COMPLETED', 'IN_PROGRESS', 'IN_REVIEW', 'TO_DO'])
  status: TaskStatus;

  @IsNumber()
  id: number;
}
