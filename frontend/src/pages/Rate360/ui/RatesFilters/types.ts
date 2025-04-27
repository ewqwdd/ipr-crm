import { Option } from '@/shared/types/Option';
import { DateObject } from 'react-multi-date-picker';
import { MultiValue } from 'react-select';
import { RateProgress } from './constatnts';
import { Rate } from '@/entities/rates';

export type FiltersSkillType = 'ALL' | Rate['type'];
export type FiltersProgress = 'ALL' | RateProgress;

export type Filters = {
  teams: MultiValue<Option>;
  userId: number | 'ALL';
  specId: number | 'ALL';
  progress: FiltersProgress;
  status?: string;
  skillType: FiltersSkillType;
  period?: DateObject[];
};
