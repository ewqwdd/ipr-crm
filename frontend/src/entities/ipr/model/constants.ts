import { MaterialType } from '@/entities/material';
import { TaskPriority, TaskStatus } from './types';
import { BadgeProps } from '@/shared/ui/Badge/Badge';

export const columnNames: Record<TaskStatus, string> = {
  TO_DO: 'Назначено',
  IN_PROGRESS: 'В работе',
  IN_REVIEW: 'На проверке',
  COMPLETED: 'Готово',
};

export const typeColors: Record<MaterialType, BadgeProps['color']> = {
  ARTICLE: 'blue',
  BOOK: 'pink',
  COURSE: 'indigo',
  VIDEO: 'purple',
};

export const priorityNames: Record<TaskPriority, string> = {
  HIGH: 'Высокий',
  MEDIUM: 'Средний',
  LOW: 'Низкий',
};

export const lane_names: TaskStatus[] = [
  'TO_DO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'COMPLETED',
];
