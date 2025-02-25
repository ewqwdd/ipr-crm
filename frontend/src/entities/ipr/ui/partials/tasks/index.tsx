import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Task, TaskPriority } from '@/entities/ipr/model/types';
import ActionBar from './ActionBar';
import { TaskList } from './TaskList';
import { toggleTaskSelection } from './helpers';
import TaskFilter from './TaskFilter';
import { iprApi } from '@/shared/api/iprApi';
import toast from 'react-hot-toast';

type TasksProps = {
  tasks?: Task[];
  loading?: boolean;
};

const successHandling = (
  changeTaskPriority: boolean,
  changeTaskStatus: boolean,
) => {
  switch (true) {
    case changeTaskPriority:
      toast.success('Приоритет задачи успешно изменен');
      break;
    case changeTaskStatus:
      toast.success('Статус задачи успешно изменен');
      break;
    default:
      break;
  }
};

const errorHandling = (
  changeTaskPriority: boolean,
  changeTaskStatus: boolean,
) => {
  switch (true) {
    case changeTaskPriority:
      toast.error('АУЕ Ошибка изменения приоритета задачи');
      break;
    case changeTaskStatus:
      toast.error('АУЕ Ошибка изменения статуса задачи');
      break;
    default:
      break;
  }
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
  const selectedType =
    selectedGeneral.length > 0
      ? 'GENERAL'
      : selectedObvious.length > 0
        ? 'OBVIOUS'
        : 'OTHER';

  return { selectedMaterials, selectedType };
};

const Tasks: FC<TasksProps> = ({
  tasks,
  // loading // TODO: add loading
}) => {
  const [selectedGeneral, setSelectedGeneral] = useState<number[]>([]);
  const [selectedObvious, setSelectedObvious] = useState<number[]>([]);
  const [selectedOther, setSelectedOther] = useState<number[]>([]);

  const selectGeneralTask = toggleTaskSelection(setSelectedGeneral);
  const selectObviousTask = toggleTaskSelection(setSelectedObvious);
  const selectOtherTask = toggleTaskSelection(setSelectedOther);

  const [
    changeTaskPriority_mutate,
    {
      isLoading: changeTaskPriority_Loading,
      isSuccess: changeTaskPriority_success,
      isError: changeTaskPriority_error,
    },
  ] = iprApi.useChangeTaskPriorityMutation();

  const [
    changeTaskStatus_mutate,
    {
      isLoading: changeTaskStatus_Loading,
      isSuccess: changeTaskStatus_success,
      isError: changeTaskStatus_error,
    },
  ] = iprApi.useChangeTaskStatusMutation();

  const changeTaskPriority = useCallback(
    (id: number, priority: TaskPriority) => {
      changeTaskPriority_mutate({ id, priority });
    },
    [changeTaskPriority_mutate],
  );

  const changeTaskStatus = useCallback(
    (id: number, status: Task['status']) => {
      changeTaskStatus_mutate({ id, status });
    },
    [changeTaskStatus_mutate],
  );

  useEffect(() => {
    successHandling(changeTaskPriority_success, changeTaskStatus_success);
  }, [changeTaskPriority_success, changeTaskStatus_success]);

  useEffect(() => {
    errorHandling(changeTaskPriority_error, changeTaskStatus_error);
  }, [changeTaskPriority_error, changeTaskStatus_error]);

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
              loading={changeTaskPriority_Loading || changeTaskStatus_Loading}
              changeTaskPriority={changeTaskPriority}
              changeTaskStatus={changeTaskStatus}
            />
          ))
        }
      </TaskFilter>
      <TaskFilter
        tasks={groupedTasks.OBVIOUS}
        filterName={'obvious'}
        title="Очевидные задачи"
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
              loading={changeTaskPriority_Loading || changeTaskStatus_Loading}
              changeTaskPriority={changeTaskPriority}
              changeTaskStatus={changeTaskStatus}
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
              loading={changeTaskPriority_Loading || changeTaskStatus_Loading}
              changeTaskPriority={changeTaskPriority}
              changeTaskStatus={changeTaskStatus}
            />
          ))
        }
      </TaskFilter>

      <ActionBar
        type={selectedType}
        selectedMaterials={selectedMaterials}
        resetSelection={resetSelection}
      />
    </div>
  );
};

export default memo(Tasks);
