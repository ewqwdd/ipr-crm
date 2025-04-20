import { FC, memo, useState } from 'react';
import { filters } from './constants';
import { Radio } from '@/shared/ui/Radio';
import { Task, TaskStatus } from '@/entities/ipr/model/types';
import { filterTasksByStatus, handleFilterChange } from './helpers';
import NoTasks from './NoTasks';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon } from '@heroicons/react/outline';

interface TaskFilterProps {
  groupedTasks: Task[][];
  notAssignedTasks: Task[];
  title: string;
  filterName: string;
  createTask: () => void;
  children: (props: {
    filteredGroupedTasks: Task[][];
    filteredNotAssignedTasks: Task[];
  }) => React.ReactNode;
}

const TaskFilter: FC<TaskFilterProps> = ({
  groupedTasks,
  notAssignedTasks,
  title,
  filterName,
  createTask,
  children,
}) => {
  const [filter, setFilter] = useState<TaskStatus>('ALL' as TaskStatus);

  const handleFilter = handleFilterChange(setFilter);
  const filteredGroupedTasks = filterTasksByStatus(groupedTasks, filter);
  const filteredNotAssignedTasks = filterTasksByStatus(
    notAssignedTasks,
    filter,
  );

  return (
    <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold ">{title}</h3>
        <SoftButton onClick={createTask} className="max-sm:p-1">
          <PlusCircleIcon className="w-5 h-5 max-sm:w-6 max-sm:h-6 sm:mr-1" />
          <span className="max-sm:hidden">Добавить задачу</span>
        </SoftButton>
      </div>
      <div className="flex gap-3 sm:gap-6 mb-4 max-sm:flex-wrap">
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
      {children({ filteredGroupedTasks, filteredNotAssignedTasks })}
      {filteredGroupedTasks.length === 0 &&
        filteredNotAssignedTasks.length === 0 && <NoTasks />}
    </div>
  );
};

export default memo(TaskFilter);
