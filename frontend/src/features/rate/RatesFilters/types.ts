import { DateObject } from 'react-multi-date-picker';
import { Rate } from '@/entities/rates';
import { TeamsHierarchyFilterType } from '@/widgets/TeamsHierarchyFilter/types';

export type FiltersSkillType = 'ALL' | Rate['type'];

export type Filters = {
  teams: TeamsHierarchyFilterType;
  userId: number | 'ALL';
  specId: number | 'ALL';
  status: 'COMPLETED' | 'NOT_COMPLETED' | 'ALL';
  skillType: FiltersSkillType;
  period?: DateObject[];
  hidden?: boolean;
};
