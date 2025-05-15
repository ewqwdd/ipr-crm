import { FC } from 'react';
import { useModal } from '@/app/hooks/useModal';
import { Ipr, Task } from '@/entities/ipr/model/types';
import { Checkbox } from '@/shared/ui/Checkbox';
import { SoftButton } from '@/shared/ui/SoftButton';

interface TaskListHeaderProps {
  type: 'COMPETENCY' | 'INDICATOR';
  tasks: Task[];
  disableSelect: boolean;
  selected: number[];
  select: (taskId: number | number[]) => void;
  planId?: number;
  userId?: number;
  taskType: Task['type'];
  skillType?: Ipr['skillType'];
}

export const TaskListHeader: FC<TaskListHeaderProps> = ({
  type,
  tasks,
  planId,
  userId,
  taskType,
  skillType,
  selected,
  select,
  disableSelect,
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
          skillType,
        });
        break;
      case 'INDICATOR':
        openModal('ADD_TASK_INDICATOR', {
          indicatorId: tasks[0].indicatorId,
          planId,
          userId,
          taskType,
          skillType,
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

  const firstTask = tasks[0] as Task & {
    competency: { name: string; archived: boolean };
    indicator: { name: string; archived: boolean };
  };
  const competencyName = firstTask?.competency?.name;
  const indicatorName = firstTask?.indicator?.name;

  return (
    <div className="flex  justify-between items-center mb-3 mt-5">
      <div className="flex items-center gap-4 max-sm:flex-col-reverse max-sm:gap-2 max-sm:items-start">
        <div className="flex space-x-2 items-center">
          <h4 className="font-medium">
            {(competencyName || indicatorName) ?? 'Без названия'}
          </h4>
        </div>
        <Checkbox
          className="whitespace-nowrap"
          disabled={disableSelect}
          title="Выбрать все"
          onChange={selectAll}
          checked={isSelectedAll}
        />
      </div>
      <SoftButton onClick={createTask}>Добавить задачу</SoftButton>
    </div>
  );
};
