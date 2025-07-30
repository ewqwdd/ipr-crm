import { Material, MaterialType } from '@/entities/material';
import { Rate } from '@/entities/rates';
import { Competency, Indicator } from '@/entities/skill';
import { User } from '@/entities/user';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@caldwell619/react-kanban';

export const taskStatuses = [
  'TO_DO',
  'IN_PROGRESS',
  'COMPLETED',
  'IN_REVIEW',
] as const;

export const taskTypes = ['GENERAL', 'OBVIOUS', 'OTHER'] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskType = (typeof taskTypes)[number];
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: number;
  deadline: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  onBoard: boolean;
  planId: number;
  competencyId: number | null;
  indicatorId: number | null;
  materialId: number | null;
  material: Material | null;
  indicator: Indicator | null;
  competency: Competency | null;
}

export interface Ipr {
  id: number;
  userId: number;
  startDate: string;
  endDate: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  goal: string;
  result: string | null;
  specId: number | null;
  rate360Id: number;
  archived: boolean;
  version: string;
  skillType: 'HARD' | 'SOFT';
  tasks: Task[];
  user: User;
  rate360: Rate;
  team: { name: string };
  planCurators: {
    user: {
      avatar?: string;
      id: number;
      username: string;
    };
  }[];
}

export interface CustomCard extends Card {
  id: string;
  priority: TaskPriority;
  materialType: MaterialType;
  badgeColor?: keyof typeof Badge.colors;
  task: Task;
}
