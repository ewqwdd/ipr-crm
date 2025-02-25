import { FC, memo, useState } from 'react';
import { filters } from './constants';
import { Radio } from '@/shared/ui/Radio';
import { Task, TaskStatus } from '@/entities/ipr/model/types';
import { filterTasksByStatus, handleFilterChange } from './helpers';
import NoTasks from './NoTasks';

interface TaskFilterProps {
  tasks: Task[][];
  title: string;
  filterName: string;
  children: (tasks: Task[][]) => React.ReactNode;
}

const TaskFilter: FC<TaskFilterProps> = ({
  tasks,
  title,
  filterName,
  children,
}) => {
  const [filter, setFilter] = useState<TaskStatus>('ALL' as TaskStatus);

  const handleFilter = handleFilterChange(setFilter);
  const filteredTasks = filterTasksByStatus(tasks, filter);

  return (
    <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 mb-5">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="flex gap-6 mb-4">
        {filters.map(({ label, key }) => (
          <Radio
            key={key}
            name={filterName}
            value={key}
            checked={filter === key}
            onChange={handleFilter}
          >
            {label}
          </Radio>
        ))}
      </div>
      {children(filteredTasks)}
      {filteredTasks.length === 0 && <NoTasks />}
    </div>
  );
};

export default memo(TaskFilter);
