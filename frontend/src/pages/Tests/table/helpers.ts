import { DateObject } from 'react-multi-date-picker';

export type TestTableFilterType = {
  name: string;
  status: 'VISSIBLE' | 'HIDDEN' | 'ALL';
  period?: DateObject | DateObject[];
};

export const initialFilters: TestTableFilterType = {
  name: '',
  status: 'ALL',
  period: undefined,
};

export const testStatusOptions = [
  { value: 'VISSIBLE', label: 'Опубликован' },
  { value: 'HIDDEN', label: 'Черновик' },
];
