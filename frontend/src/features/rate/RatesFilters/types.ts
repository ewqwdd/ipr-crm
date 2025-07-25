import { DateObject } from 'react-multi-date-picker';
import { Rate } from '@/entities/rates';
import { TeamsHierarchyFilterType } from '@/widgets/TeamsHierarchyFilter/types';

export type FiltersSkillType = 'ALL' | Rate['type'];

export type Filters = {
  teams: TeamsHierarchyFilterType;
  userId: number | 'ALL';
  specId: number | 'ALL';
  curatorId: number | 'ALL';
  status:
    | 'COMPLETED'
    | 'NOT_COMPLETED'
    | 'NOT_CONFIRMED'
    | 'CONFIRMED'
    | 'CONFIRMED_BY_USER'
    | 'ALL';
  skillType: FiltersSkillType;
  period?: DateObject[];
  hidden?: boolean;
  page: number;
};
