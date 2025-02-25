import { Task } from '@/entities/ipr/model/types';
import { type Material } from '@/entities/material';
import { materialTypes } from '@/entities/material/model/types';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import { FC } from 'react';
import { PrioritySelector } from './PrioritySelector';
import { columnNames, lane_names } from '@/entities/ipr/model/constants';
import { Link } from 'react-router';

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

const MaterialType: FC<{ contentType?: MaterialType; url?: string }> = ({
  contentType,
  url,
}) => {
  const children = getMaterialTypeLabel(contentType);
  return (
    <div className="text-sm text-gray-500">
      {url ? (
        <Link to={url} target="_blank" className="text-indigo-500">
          {children}
        </Link>
      ) : (
        children
      )}
    </div>
  );
};

const statusOptions = lane_names.map((status) => ({
  value: status,
  label: columnNames[status],
}));

const Status: FC<{
  status?: Status;
  onChange: (id: number, status: Task['status']) => void;
  isLoading?: boolean;
  id: number;
}> = ({ id, status, onChange, isLoading }) => {
  const onChangeHandler = (status: Status) => {
    onChange(id, status);
  };

  return (
    <SelectLight
      name="status"
      value={status}
      onChange={(e) => onChangeHandler(e.target.value as Status)}
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
