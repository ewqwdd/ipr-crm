import { Task } from '@/entities/ipr/model/types';
import { type Material } from '@/entities/material';
import { materialTypes } from '@/entities/material/model/types';
import { cva } from '@/shared/lib/cva';
import { FC } from 'react';
import Select, { SingleValue } from 'react-select';

type Priority = Task['priority'];
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

const priorityOptions = [
  { value: 'HIGH', label: 'Высокая' },
  { value: 'MEDIUM', label: 'Средняя' },
  { value: 'LOW', label: 'Низкая' },
];

const Priority: FC<{
  priority: Priority;
  onChange: (status: Priority) => void;
  isLoading?: boolean;
}> = ({ priority, onChange, isLoading }) => {
  const onChangeHendler = (
    newValue: SingleValue<{ value: string; label: string }>,
  ) => {
    if (newValue) {
      onChange(newValue.value as Priority);
    }
  };

  return (
    <Select
      options={priorityOptions}
      value={
        priorityOptions.find((option) => option.value === priority) || null
      }
      onChange={onChangeHendler}
      className={cva('basic-multi-select', {
        'animate-pulse': !!isLoading,
      })}
    />
  );
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
  const onChangeHendler = (
    newValue: SingleValue<{ value: string; label: string }>,
  ) => {
    if (newValue) {
      onChange(newValue.value as Status);
    }
  };

  return (
    <Select
      onChange={onChangeHendler}
      options={statusOptions}
      value={statusOptions.find((option) => option.value === status) || null}
      className={cva('basic-multi-select', {
        'animate-pulse': !!isLoading,
      })}
    />
  );
};

const TaskItem = {
  MaterialType,
  Priority,
  Status,
};

export default TaskItem;
