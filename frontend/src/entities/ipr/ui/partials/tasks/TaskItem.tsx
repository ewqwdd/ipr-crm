import { Task } from '@/entities/ipr/model/types';
import { type Material } from '@/entities/material';
import { materialTypes } from '@/entities/material/model/types';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import { ChangeEvent, FC, useState } from 'react';
import { PrioritySelector } from './PrioritySelector';
import { columnNames, lane_names } from '@/entities/ipr/model/constants';
import { Link } from 'react-router';
import { $api } from '@/shared/lib/$api';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/app';
import { iprApi } from '@/shared/api/iprApi';

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
  isLoading?: boolean;
  id: number;
  userId?: number;
}> = ({ status: status_, isLoading, id, userId }) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<Status | undefined>(status_);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const previous = status;
    setStatus(e.target.value as Status);
    $api
      .post(`/ipr/task/status`, { status, id })
      .catch(() => {
        setStatus(previous);
        toast.error('Не удалось обновить статус');
      })
      .then(() => {
        dispatch(iprApi.util.invalidateTags([{ type: 'board', id: userId }]));
      })
      .then(() => {
        toast.success('Статус успешно обновлен');
      });
  };

  return (
    <SelectLight
      name="status"
      value={status}
      onChange={onChange}
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
