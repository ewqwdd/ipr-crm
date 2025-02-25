import { TaskMaterialType, TaskPriority } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddTaskDto {
  @IsNumber()
  planId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  competencyId: number;

  @IsOptional()
  @IsNumber()
  indicatorId: number;

  @IsString()
  url?: string;

  @IsDateString()
  deadline: string;

  @IsNotEmpty()
  @IsEnum(['VIDEO', 'BOOK', 'COURSE', 'ARTICLE'])
  contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';

  @IsEnum(['HIGH', 'MEDIUM', 'LOW'])
  priority: TaskPriority;

  @IsEnum(['GENERAL', 'OBVIOUS', 'OTHER'])
  taskType: TaskMaterialType;

  @IsNumber()
  userId: number;
}
