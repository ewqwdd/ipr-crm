import { useAppDispatch } from '@/app';
import { TaskPriority } from '@/entities/ipr/model/types';
import { iprApi } from '@/shared/api/iprApi';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import { ChangeEvent, FC } from 'react';
import toast from 'react-hot-toast';
import { taskPriorityOptions } from '../constants';

type PrioritySelectorProps = {
  priority: TaskPriority;
  isLoading?: boolean;
  isLabel?: boolean;
  required?: boolean;
  id?: number;
  userId?: number;
  onChange?: (priority: TaskPriority) => void;
};

export const PrioritySelector: FC<PrioritySelectorProps> = ({
  priority: priority_,
  isLoading,
  isLabel,
  required,
  id,
  userId,
  onChange: onChange_,
}) => {
  const label = isLabel ? 'Важность' : undefined;

  const dispatch = useAppDispatch();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange_) {
      onChange_(e.target.value as TaskPriority);
      return;
    }

    $api
      .post(`/ipr/${id}/priority`, { priority: e.target.value })
      .then(() => {
        dispatch(iprApi.util.invalidateTags([{ type: 'board', id: userId }]));
        dispatch(iprApi.util.invalidateTags(['ipr']));
      })
      .then(() => {
        toast.success('Приоритет успешно обновлен');
      })
      .catch(() => {
        toast.error('Не удалось обновить приоритет');
      });
  };

  return (
    <SelectLight
      value={priority_}
      onChange={onChange}
      className={cva(
        'basic-multi-select text-sm [&>select]:max-xl:pl-2 [&>select]:max-xl:pr-6',
        {
          'animate-pulse': !!isLoading,
        },
      )}
      label={label}
      required={required}
    >
      {taskPriorityOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </SelectLight>
  );
};
