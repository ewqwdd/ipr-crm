import { FC, memo, useMemo, useState } from 'react';
import { Task, TaskType } from '@/entities/ipr/model/types';
import { ActionBar } from './ActionBar';
import { TaskList } from './TaskList';
import { toggleTaskSelection } from './helpers';
import TaskFilter from './TaskFilter';

type TasksProps = {
  tasks?: Task[];
  loading?: boolean;
  userId?: number;
  planId?: number;
};

const Tasks: FC<TasksProps> = ({
  tasks,
  planId,
  userId,
  // loading // TODO: add loading
}) => {
  const [selectedGeneral, setSelectedGeneral] = useState<number[]>([]);
  const [selectedObvious, setSelectedObvious] = useState<number[]>([]);
  const [selectedOther, setSelectedOther] = useState<number[]>([]);

  const selectGeneralTask = toggleTaskSelection(setSelectedGeneral);
  const selectObviousTask = toggleTaskSelection(setSelectedObvious);
  const selectOtherTask = toggleTaskSelection(setSelectedOther);

  const groupedTasks = useMemo(() => {
    return ['GENERAL', 'OBVIOUS', 'OTHER'].reduce(
      (acc, type) => {
        const filteredTasks = tasks?.filter((task) => task.type === type) ?? [];

        const groupKey = type === 'GENERAL' ? 'competencyId' : 'indicatorId';

        const groupedByKey = Object.values(
          filteredTasks.reduce<Record<number, Task[]>>((acc, task) => {
            const key = task[groupKey];
            if (key) {
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(task);
            }
            return acc;
          }, {}),
        );

        return { ...acc, [type]: groupedByKey };
      },
      {} as Record<'GENERAL' | 'OBVIOUS' | 'OTHER', Task[][]>,
    );
  }, [tasks]);

  const selectedMaterials =
    selectedGeneral.length > 0
      ? selectedGeneral
      : selectedObvious.length > 0
        ? selectedObvious
        : [];

  const resetSelection = () => {
    if (selectedGeneral.length > 0) {
      return setSelectedGeneral([]);
    }
    if (selectedObvious.length > 0) {
      return setSelectedObvious([]);
    }
    if (selectedOther.length > 0) {
      return setSelectedOther([]);
    }
  };

  let typeSelected: TaskType = 'OTHER';
  switch (true) {
    case selectedGeneral.length > 0:
      typeSelected = 'GENERAL';
      break;
    case selectedObvious.length > 0:
      typeSelected = 'OBVIOUS';
      break;
  }

  return (
    <div>
      <TaskFilter
        tasks={groupedTasks.GENERAL}
        filterName={'general'}
        title="Общие материалы и задачи для развития"
      >
        {(filteredTasks) =>
          filteredTasks.map((tasks) => (
            <TaskList
              type="COMPETENCY"
              key={tasks[0]?.competencyId}
              competencyName={tasks[0]?.competency?.name}
              tasks={tasks}
              disableSelect={selectedObvious.length > 0}
              selected={selectedGeneral}
              select={selectGeneralTask}
              taskType={'GENERAL'}
              planId={planId}
              userId={userId}
            />
          ))
        }
      </TaskFilter>
      <TaskFilter
        tasks={groupedTasks.OBVIOUS}
        filterName={'obvious'}
        title="Очевидные зоны роста"
      >
        {(filteredTasks) =>
          filteredTasks.map((tasks) => (
            <TaskList
              type="INDICATOR"
              key={tasks[0]?.indicatorId}
              competencyName={tasks[0]?.indicator?.name}
              tasks={tasks}
              disableSelect={selectedGeneral.length > 0}
              selected={selectedObvious}
              select={selectObviousTask}
              taskType={'OBVIOUS'}
              planId={planId}
              userId={userId}
            />
          ))
        }
      </TaskFilter>
      <TaskFilter
        tasks={groupedTasks.OTHER}
        title="Прочие материалы и задачи для развития"
        filterName={'other'}
      >
        {(filteredTasks) =>
          filteredTasks.map((tasks) => (
            <TaskList
              type="INDICATOR"
              key={tasks[0]?.indicatorId}
              competencyName={tasks[0]?.indicator?.name}
              tasks={tasks}
              disableSelect={selectedGeneral.length > 0}
              selected={selectedOther}
              select={selectOtherTask}
              taskType={'OTHER'}
              planId={planId}
              userId={userId}
            />
          ))
        }
      </TaskFilter>

      {planId && userId && (
        <ActionBar
          selectedMaterials={selectedMaterials}
          resetSelection={resetSelection}
          planId={planId}
          userId={userId}
          type={typeSelected}
        />
      )}
    </div>
  );
};

export default memo(Tasks);
