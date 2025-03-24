import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';

export type Filters = {
  teams: MultiValue<Option>;
  userId: number | 'ALL';
  specs: MultiValue<Option>;
};

export const initialFilters: Filters = {
  teams: [],
  userId: 'ALL',
  specs: [],
};
