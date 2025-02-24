import { Material } from '@/entities/material';
import { Rate } from '@/entities/rates';
import { Competency, Indicator } from '@/entities/skill';
import { User } from '@/entities/user';

export interface Task {
  id: number;
  deadline: string | null;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  type: 'GENERAL' | 'OBVIOUS';
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
  mentorId: number | null;
  rate360Id: number;
  archived: boolean;
  version: string;
  skillType: 'HARD' | 'SOFT';
  tasks: Task[];
  mentor: User | null;
  user: User;
  rate360: Rate;
}
