import { columnNames, lane_names } from '@/entities/ipr/model/constants';

export const filters = [
  { label: 'Все', key: 'ALL' },
  ...lane_names.map((status) => ({
    label: columnNames[status],
    key: status,
  })),
];
