import { columnNames, lane_names } from '@/entities/ipr/model/constants';

export const filters = [
  { label: 'Все', key: 'ALL' },
  ...lane_names.map((status) => ({
    label: columnNames[status],
    key: status,
  })),
];

export const taskTypeMap = {
  GENERAL: 'ADD_TASK_COMPETENCY',
  OBVIOUS: 'ADD_TASK_INDICATOR',
  OTHER: 'ADD_TASK_INDICATOR',
};
