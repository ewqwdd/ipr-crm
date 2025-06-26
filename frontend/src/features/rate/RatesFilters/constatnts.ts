import { Rate } from '@/entities/rates';
import { Filters } from './types';

export const skillTypeOptions: Array<{ value: Rate['type']; label: string }> = [
  { value: 'SOFT', label: 'Soft skills' },
  { value: 'HARD', label: 'Hard skills' },
] as const;

// TODO: add rate360StatusOptions
// export const rate360StatusOptions = [];

export const progressOptions: Array<{
  value: 'COMPLETED' | 'NOT_COMPLETED' | 'ALL';
  label: string;
}> = [
  { value: 'COMPLETED', label: 'Завершён' },
  { value: 'NOT_COMPLETED', label: 'Не завершён' },
] as const;

export const initialFilters: Filters = {
  teams: {},
  skillType: 'ALL',
  userId: 'ALL',
  specId: 'ALL',
  period: undefined,
  status: 'ALL', // TODO: add status
};
