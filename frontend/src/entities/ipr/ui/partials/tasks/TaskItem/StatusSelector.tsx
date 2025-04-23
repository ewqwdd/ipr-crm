import { FC, ChangeEvent } from 'react';

import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/app';
import { iprApi } from '@/shared/api/iprApi';
import { taskStatusOptions } from '../constants';
import { Task } from '@/entities/ipr/model/types';
import { $api } from '@/shared/lib/$api';

type Status = Task['status'];

type StatusSelectorProps = {
  status?: Status;
  isLoading?: boolean;
  id: number;
  userId?: number;
  onChange?: (status: Status) => void;
};

const StatusSelector: FC<StatusSelectorProps> = ({
  status: status_,
  isLoading,
  id,
  userId,
  onChange: onChange_,
}) => {
  const dispatch = useAppDispatch();
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange_) onChange_(e.target.value as Status);
    $api
      .post(`/ipr/task/status`, { status: e.target.value, id })
      .then(() => {
        toast.success('Статус успешно обновлен');
        dispatch(iprApi.util.invalidateTags([{ type: 'board', id: userId }]));
        dispatch(iprApi.util.invalidateTags(['ipr']));
      })
      .catch(() => {
        toast.error('Не удалось обновить статус');
      });
  };

  return (
    <SelectLight
      name="status"
      value={status_}
      onChange={onChange}
      className={cva(
        'basic-multi-select text-sm [&>select]:max-xl:pl-2 [&>select]:pr-6',
        {
          'animate-pulse': !!isLoading,
        },
      )}
    >
      {taskStatusOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </SelectLight>
  );
};

export default StatusSelector;
