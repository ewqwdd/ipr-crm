import { TaskMaterialType, TaskPriority } from '@prisma/client';
import {
  IsBoolean,
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
  @IsOptional()
  deadline?: string;

  @IsNotEmpty()
  @IsEnum(['VIDEO', 'BOOK', 'COURSE', 'ARTICLE', 'TASK'])
  contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE' | 'TASK';

  @IsEnum(['HIGH', 'MEDIUM', 'LOW'])
  priority: TaskPriority;

  @IsEnum(['GENERAL', 'OBVIOUS', 'OTHER'])
  taskType: TaskMaterialType;

  @IsOptional()
  @IsBoolean()
  addToConstructor?: boolean;

  @IsNumber()
  userId: number;
}
