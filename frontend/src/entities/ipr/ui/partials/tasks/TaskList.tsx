import { Task } from '@/entities/ipr/model/types';
import { Checkbox } from '@/shared/ui/Checkbox';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC } from 'react';
import TaskItem from './TaskItem';
import { useModal } from '@/app/hooks/useModal';
import { formatDate } from './helpers';
interface TaskListProps {
  competencyName?: string;
  indicatorName?: string;
  tasks: Task[];
  disableSelect: boolean;
  selected: number[];
  select: (taskId: number | number[]) => void;
  type: 'COMPETENCY' | 'INDICATOR';
  planId?: number;
  userId?: number;
  taskType: Task['type'];
}

const headerItems = [
  'Материал',
  'Тип материала',
  'Важность',
  'Дедлайн',
  'Статус',
];

const TableHeader: FC = () => (
  <thead className="bg-gray-50">
    <tr className="h-[48px] text-left">
      {headerItems.map((item) => (
        <th
          key={item}
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          {item}
        </th>
      ))}
    </tr>
  </thead>
);

export const TaskList: FC<TaskListProps> = ({
  competencyName,
  indicatorName,
  tasks,
  disableSelect,
  selected,
  select,
  type,
  planId,
  userId,
  taskType,
}) => {
  const { openModal } = useModal();
  const createTask = () => {
    switch (type) {
      case 'COMPETENCY':
        openModal('ADD_TASK_COMPETENCY', {
          competencyId: tasks[0].competencyId,
          planId,
          userId,
          taskType,
        });
        break;
      case 'INDICATOR':
        openModal('ADD_TASK_INDICATOR', {
          indicatorId: tasks[0].indicatorId,
          planId,
          userId,
          taskType,
        });
        break;
      default:
        break;
    }
  };

  const isSelectedAll = tasks.every(({ id }) => selected.includes(id));
  const selectAll = () => {
    select(tasks.map(({ id }) => id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4 ">
          <h4>{(competencyName || indicatorName) ?? 'Без названия'}</h4>
          <Checkbox
            disabled={disableSelect}
            title="Выбрать все"
            onChange={selectAll}
            checked={isSelectedAll}
          />
        </div>
        <SoftButton onClick={createTask}>Добавить задачу</SoftButton>
      </div>
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg pb-[14px]">
        <table className="min-w-[1400px] divide-y divide-gray-300">
          <TableHeader />
          <tbody className="divide-y divide-gray-200 bg-white">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="w-[40%] py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                  <Checkbox
                    disabled={disableSelect}
                    checked={selected.includes(task.id)}
                    onChange={() => select(task.id)}
                    title={task.material?.name}
                  />
                </td>
                <td className="w-[18%] px-3 py-4 ">
                  <TaskItem.MaterialType
                    contentType={task.material?.contentType}
                    url={task.material?.url}
                  />
                </td>
                <td className="w-[12%] px-3 py-4 text-sm text-gray-500">
                  <TaskItem.Priority
                    id={task.id}
                    priority={task.priority}
                    userId={userId}
                  />
                </td>
                <td className="w-[18%] px-3 py-4 text-sm text-gray-500">
                  {formatDate(task.deadline)}
                </td>
                <td className="w-[12%] px-3 py-4 text-sm text-gray-500">
                  <TaskItem.Status
                    id={task.id}
                    status={task.status}
                    userId={userId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
