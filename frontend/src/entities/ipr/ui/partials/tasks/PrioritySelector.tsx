import { Task, TaskPriority } from '@/entities/ipr/model/types';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import { FC } from 'react';

type PrioritySelectorProps = {
  priority: TaskPriority;
  onChange: (id: number, priority: Task['priority']) => void;
  isLoading?: boolean;
  isLabel?: boolean;
  required?: boolean;
  id: number;
};

const priorityOptions = [
  { value: 'HIGH', label: 'Высокая' },
  { value: 'MEDIUM', label: 'Средняя' },
  { value: 'LOW', label: 'Низкая' },
];

export const PrioritySelector: FC<PrioritySelectorProps> = ({
  priority,
  onChange,
  isLoading,
  isLabel,
  required,
  id,
}) => {
  const label = isLabel ? 'Важность' : undefined;

  const onChangeHandler = (priority: TaskPriority) => {
    onChange(id, priority);
  };

  return (
    <SelectLight
      value={priority}
      onChange={(e) => onChangeHandler(e.target.value as TaskPriority)}
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
