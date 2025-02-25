import { useAppDispatch } from '@/app';
import { TaskPriority } from '@/entities/ipr/model/types';
import { iprApi } from '@/shared/api/iprApi';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import { ChangeEvent, FC, useState } from 'react';
import toast from 'react-hot-toast';

type PrioritySelectorProps = {
  priority: TaskPriority;
  isLoading?: boolean;
  isLabel?: boolean;
  required?: boolean;
  id?: number;
  userId?: number;
  onChange?: (priority: TaskPriority) => void;
};

const priorityOptions = [
  { value: 'HIGH', label: 'Высокая' },
  { value: 'MEDIUM', label: 'Средняя' },
  { value: 'LOW', label: 'Низкая' },
];

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

  const [priority, setPriority] = useState<TaskPriority>(priority_);
  const dispatch = useAppDispatch();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange_) {
      onChange_(e.target.value as TaskPriority);
      return;
    }
    const prev = priority;
    setPriority(e.target.value as TaskPriority);

    $api
      .post(`/ipr/${id}/priority`, { priority: e.target.value })
      .catch(() => {
        setPriority(prev);
        toast.error('Не удалось обновить приоритет');
      })
      .then(() => {
        dispatch(iprApi.util.invalidateTags([{ type: 'board', id: userId }]));
      });
  };

  return (
    <SelectLight
      value={onChange_ ? priority_ : priority}
      onChange={onChange}
      className={cva('basic-multi-select', {
        'animate-pulse': !!isLoading,
      })}
      label={label}
      required={required}
    >
      {priorityOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </SelectLight>
  );
};
