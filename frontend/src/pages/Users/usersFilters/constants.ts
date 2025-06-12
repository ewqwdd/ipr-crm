import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';

export type Filters = {
  teams: MultiValue<Option>;
  userId: number | 'ALL';
  specs: MultiValue<Option>;
  access: 'ALL' | 'ACTIVE' | 'INACTIVE';
};

export const initialFilters: Filters = {
  teams: [],
  userId: 'ALL',
  specs: [],
  access: 'ALL',
};

export const accessOptions: Option[] = [
  { value: 'ALL', label: 'Все' },
  { value: 'ACTIVE', label: 'Активные' },
  { value: 'INACTIVE', label: 'Неактивные' },
];
