import { Task } from '@/entities/ipr/model/types';
import { type Material } from '@/entities/material';
import { materialTypes } from '@/entities/material/model/types';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import { FC } from 'react';
import { PrioritySelector } from './PrioritySelector';

type Status = Task['status'];
type MaterialType = Material['contentType'];

const getMaterialTypeLabel = (contentType?: MaterialType) => {
  switch (contentType) {
    case 'ARTICLE':
      return materialTypes['ARTICLE'];
    case 'BOOK':
      return materialTypes['BOOK'];
    case 'COURSE':
      return materialTypes['COURSE'];
    case 'VIDEO':
      return materialTypes['VIDEO'];

    default:
      return <></>;
  }
};

const MaterialType: FC<{ contentType?: MaterialType }> = ({ contentType }) => {
  return <div>{getMaterialTypeLabel(contentType)}</div>;
};

const statusOptions = [
  { value: 'TO_DO', label: 'Новая' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'DONE', label: 'Готово' },
];

const Status: FC<{
  status?: Status;
  onChange: (status: Status) => void;
  isLoading?: boolean;
}> = ({ status, onChange, isLoading }) => {
  return (
    <SelectLight
      value={status}
      onChange={(e) => onChange(e.target.value as Status)}
      className={cva('basic-multi-select', {
        'animate-pulse': !!isLoading,
      })}
    >
      {statusOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </SelectLight>
  );
};

const TaskItem = {
  MaterialType,
  Priority: PrioritySelector,
  Status,
};

export default TaskItem;
