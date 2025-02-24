import { TaskPriority } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class SetPriorityStatusDto {
  @IsEnum(['HIGH', 'MEDIUM', 'LOW'])
  priority: TaskPriority;
}
