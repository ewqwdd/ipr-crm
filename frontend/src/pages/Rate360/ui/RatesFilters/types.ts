import { Option } from '@/shared/types/Option';
import { DateObject } from 'react-multi-date-picker';
import { MultiValue } from 'react-select';
import { Rate } from '@/entities/rates';

export type FiltersSkillType = 'ALL' | Rate['type'];

export type Filters = {
  teams: MultiValue<Option>;
  userId: number | 'ALL';
  specId: number | 'ALL';
  status: 'COMPLETED' | 'NOT_COMPLETED' | 'ALL';
  skillType: FiltersSkillType;
  period?: DateObject[];
  hidden?: boolean;
};
