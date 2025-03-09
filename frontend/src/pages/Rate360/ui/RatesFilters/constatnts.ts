import { Rate } from '@/entities/rates';
import { Filters } from './RatesFiltersWrapper';

export type RateProgress = 'COMPLETED' | 'IN_PROGRESS';

export const skillTypeOptions: Array<{ value: Rate['type']; label: string }> = [
  { value: 'SOFT', label: 'Soft skills' },
  { value: 'HARD', label: 'Hard skills' },
] as const;

// TODO: add rate360StatusOptions
// export const rate360StatusOptions = [];

export const progressOptions: Array<{
  value: RateProgress;
  label: string;
}> = [
  { value: 'COMPLETED', label: 'Завершён' },
  { value: 'IN_PROGRESS', label: 'Не завершён' },
] as const;

export const initialFilters: Filters = {
  teams: [],
  skillType: 'ALL',
  progress: 'ALL',
  userId: 'ALL',
  specId: 'ALL',
  period: undefined,
  // status: 'ALL', // TODO: add status
};
