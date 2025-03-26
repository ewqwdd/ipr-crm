import { TaskPriority } from '@/entities/ipr/model/types';
import { DateObject } from 'react-multi-date-picker';

export type BoardFiltersType = {
  priority: TaskPriority | 'ALL';
  period?: DateObject | DateObject[];
};

export const initialFilters: BoardFiltersType = {
  priority: 'ALL',
  period: undefined,
};
