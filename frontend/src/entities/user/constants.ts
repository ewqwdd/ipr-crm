import { UsersFilter } from '@/entities/user';
import { Option } from '@/shared/types/Option';

export const initialUserFilters: UsersFilter = {
  access: 'ALL',
  teams: {},
  page: 1,
};

export const userAccessOptions: Option[] = [
  { value: 'ALL', label: 'Все' },
  { value: 'ACTIVE', label: 'Активные' },
  { value: 'INACTIVE', label: 'Неактивные' },
];
