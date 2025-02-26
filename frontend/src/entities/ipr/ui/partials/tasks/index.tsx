import { FC, memo, useEffect, useMemo, useState } from 'react';
import { Ipr, Task, TaskType } from '@/entities/ipr/model/types';
import ActionBar from './ActionBar';
import { TaskList } from './TaskList';
import { toggleTaskSelection } from './helpers';
import TaskFilter from './TaskFilter';

type TasksProps = {
  tasks?: Task[];
  loading?: boolean;
  userId?: number;
  planId?: number;
  skillType?: Ipr['skillType'];
};

const costyl = (
  selectedGeneral: number[],
  selectedObvious: number[],
  selectedOther: number[],
) => {
  const selectedMaterials =
    selectedGeneral.length > 0
      ? selectedGeneral
      : selectedObvious.length > 0
        ? selectedObvious
        : selectedOther.length > 0
          ? selectedOther
          : [];
  const selectedType: TaskType =
    selectedGeneral.length > 0
      ? 'GENERAL'
      : selectedObvious.length > 0
        ? 'OBVIOUS'
        : 'OTHER';

  return { selectedMaterials, selectedType };
};

const Tasks: FC<TasksProps> = ({
  tasks,
  planId,
  userId,
  skillType,
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

  const { selectedMaterials, selectedType } = costyl(
    selectedGeneral,
    selectedObvious,
    selectedOther,
  );

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

  useEffect(() => {
    resetSelection();
  }, [tasks]);

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
              disableSelect={
                selectedObvious.length > 0 || selectedOther.length > 0
              }
              selected={selectedGeneral}
              select={selectGeneralTask}
              taskType={'GENERAL'}
              planId={planId}
              userId={userId}
              skillType={skillType}
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
              disableSelect={
                selectedGeneral.length > 0 || selectedOther.length > 0
              }
              selected={selectedObvious}
              select={selectObviousTask}
              taskType={'OBVIOUS'}
              planId={planId}
              userId={userId}
              skillType={skillType}
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
              disableSelect={
                selectedGeneral.length > 0 || selectedObvious.length > 0
              }
              selected={selectedOther}
              select={selectOtherTask}
              taskType={'OTHER'}
              planId={planId}
              userId={userId}
              skillType={skillType}
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
          type={selectedType}
        />
      )}
    </div>
  );
};

export default memo(Tasks);
