import { TaskPriority } from '@/entities/ipr/model/types';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import { FC } from 'react';

type PrioritySelectorProps = {
  priority: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  isLoading?: boolean;
  isLabel?: boolean;
  required?: boolean;
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
}) => {
  const label = isLabel ? 'Важность' : undefined;

  return (
    <SelectLight
      value={priority}
      onChange={(e) => onChange(e.target.value as TaskPriority)}
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
