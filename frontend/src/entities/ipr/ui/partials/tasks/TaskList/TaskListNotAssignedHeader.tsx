import { FC } from 'react';

import { Task } from '@/entities/ipr/model/types';
import { Checkbox } from '@/shared/ui/Checkbox';

interface TaskListNotAssignedHeaderProps {
  type: 'COMPETENCY' | 'INDICATOR';
  tasks: Task[];
  selected: number[];
  select: (taskId: number | number[]) => void;
  disableSelect: boolean;
}

const TaskListNotAssignedHeader: FC<TaskListNotAssignedHeaderProps> = ({
  type,
  tasks,
  select,
  selected,
  disableSelect,
}) => {
  const isSelectedAll = tasks.every(({ id }) => selected.includes(id));
  const selectAll = () => {
    select(tasks.map(({ id }) => id));
  };

  return (
    <div className="flex gap-4 items-center mb-3 mt-5">
      <h4 className="font-medium">
        {`Без привязки ${type === 'COMPETENCY' ? 'Компетенции' : 'Индикатору'}`}
      </h4>
      <Checkbox
        className="whitespace-nowrap"
        disabled={disableSelect}
        title="Выбрать все"
        onChange={selectAll}
        checked={isSelectedAll}
      />
    </div>
  );
};

export default TaskListNotAssignedHeader;
