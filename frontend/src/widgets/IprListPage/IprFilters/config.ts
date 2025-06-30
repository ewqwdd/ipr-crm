import { Rate } from '@/entities/rates';
import { Option } from '@/shared/types/Option';
import { DateObject } from 'react-multi-date-picker';
import { MultiValue } from 'react-select';

export type IprFilters = {
  teams: MultiValue<Option>;
  userId: number;
  specId: number | 'ALL';
  status: 'COMPLETED' | 'NOT_COMPLETED' | 'ALL';
  period?: DateObject[];
  skillType: 'ALL' | Rate['type'];
  deputyOnly?: boolean;
};

export const initialIprFilters: IprFilters = {
  teams: [],
  userId: -1,
  specId: 'ALL',
  status: 'ALL',
  skillType: 'ALL',
};

export const skillTypeOptions: Array<{ value: Rate['type']; label: string }> = [
  { value: 'SOFT', label: 'Soft skills' },
  { value: 'HARD', label: 'Hard skills' },
] as const;
