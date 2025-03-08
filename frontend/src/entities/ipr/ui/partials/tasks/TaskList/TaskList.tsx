import { Ipr, Task } from '@/entities/ipr/model/types';
import { FC, memo } from 'react';
import TaskListNotAssignedHeader from './TaskListNotAssignedHeader';
import { TaskListHeader } from './TaskListHeader';
import TaskListTable from '../TaskListTable';
import TaskListRow from '../TaskListTable/TaskListRow';

interface TaskListProps {
  isNotAssigned?: boolean;
  type: 'COMPETENCY' | 'INDICATOR';
  tasks: Task[];
  taskType: Task['type'];
  skillType?: Ipr['skillType'];
  selected: number[];
  select: (taskId: number | number[]) => void;
  disableSelect: boolean;
  planId?: number;
  userId?: number;
}

const TaskList: FC<TaskListProps> = ({
  isNotAssigned,
  type,
  tasks,
  taskType,
  skillType,
  selected,
  select,
  disableSelect,
  planId,
  userId,
}) => {
  if (!tasks?.length) {
    return null;
  }

  const HeaderComponent = isNotAssigned
    ? TaskListNotAssignedHeader
    : TaskListHeader;

  const headerProps = {
    type,
    tasks,
    selected,
    select,
    disableSelect,
    userId,
    ...(isNotAssigned ? {} : { planId, skillType }),
    taskType,
  };

  return (
    <>
      <HeaderComponent {...headerProps} />
      <TaskListTable>
        {tasks.map((task) => (
          <TaskListRow
            key={task.id}
            {...task}
            checked={selected.includes(task.id)}
            onChange={select}
            disableSelect={disableSelect}
            userId={userId}
          />
        ))}
      </TaskListTable>
    </>
  );
};

export default memo(TaskList);
