import {
  columnNames,
  lane_names,
  priorityNames,
} from '@/entities/ipr/model/constants';

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

export const taskStatusOptions = lane_names.map((status) => ({
  value: status,
  label: columnNames[status],
}));

export const taskPriorityOptions = Object.keys(priorityNames).map(
  (priority) => ({
    value: priority,
    label: priorityNames[priority as keyof typeof priorityNames],
  }),
);
