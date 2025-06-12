import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Ipr, Task } from '@/entities/ipr/model/types';
import {
  getSelectedMaterials,
  groupTasksByType,
  toggleTaskSelection,
} from './helpers';
import TaskFilter from './TaskFilter';
import { useModal } from '@/app/hooks/useModal';
import TaskList from './TaskList/TaskList';
import { taskTypeMap } from './constants';
import IprEditSettings from '../../../../../features/team/IprEditSettings/IprEditSettings';

type TasksSectionProps = {
  tasks?: Task[];
  loading?: boolean;
  userId?: number;
  planId?: number;
  skillType?: Ipr['skillType'];
};

const TasksSection: FC<TasksSectionProps> = ({
  tasks,
  planId,
  userId,
  skillType,
  // loading // TODO: add loading
}) => {
  const [selectedGeneral, setSelectedGeneral] = useState<number[]>([]);
  const [selectedObvious, setSelectedObvious] = useState<number[]>([]);
  const [selectedOther, setSelectedOther] = useState<number[]>([]);

  const { openModal } = useModal();

  const selectGeneralTask = toggleTaskSelection(setSelectedGeneral);
  const selectObviousTask = toggleTaskSelection(setSelectedObvious);
  const selectOtherTask = toggleTaskSelection(setSelectedOther);

  const groupedTasks = useMemo(() => groupTasksByType(tasks), [tasks]);

  const { selectedMaterials, selectedType } = getSelectedMaterials(
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

  const createTask = useCallback(
    (taskType: Task['type']) => {
      openModal(taskTypeMap[taskType], {
        planId,
        userId,
        skillType,
        taskType,
      });
    },
    [openModal, planId, userId, skillType],
  );

  const createTask_GENERAL = useCallback(
    () => createTask('GENERAL'),
    [createTask],
  );
  const createTask_OBVIOUS = useCallback(
    () => createTask('OBVIOUS'),
    [createTask],
  );
  const createTask_OTHER = useCallback(() => createTask('OTHER'), [createTask]);

  return (
    <div>
      <TaskFilter
        groupedTasks={groupedTasks.GENERAL.grouped}
        notAssignedTasks={groupedTasks.GENERAL.notAssigned}
        filterName={'general'}
        title="Общие материалы и задачи для развития"
        createTask={createTask_GENERAL}
      >
        {({ filteredGroupedTasks, filteredNotAssignedTasks }) => {
          return (
            <>
              {filteredGroupedTasks.map((tasks) => (
                <TaskList
                  key={tasks[0].competencyId}
                  type="COMPETENCY"
                  taskType={'GENERAL'}
                  selected={selectedGeneral}
                  select={selectGeneralTask}
                  disableSelect={
                    selectedObvious.length > 0 || selectedOther.length > 0
                  }
                  {...{
                    tasks,
                    planId,
                    userId,
                    skillType,
                  }}
                />
              ))}
              <TaskList
                isNotAssigned={true}
                type="COMPETENCY"
                taskType="GENERAL"
                tasks={filteredNotAssignedTasks}
                selected={selectedGeneral}
                select={selectGeneralTask}
                disableSelect={
                  selectedObvious.length > 0 || selectedOther.length > 0
                }
                userId={userId}
              />
            </>
          );
        }}
      </TaskFilter>
      <TaskFilter
        groupedTasks={groupedTasks.OBVIOUS.grouped}
        notAssignedTasks={groupedTasks.OBVIOUS.notAssigned}
        filterName={'obvious'}
        title="Очевидные зоны роста"
        createTask={createTask_OBVIOUS}
      >
        {({ filteredGroupedTasks, filteredNotAssignedTasks }) => {
          return (
            <>
              {filteredGroupedTasks.map((tasks) => (
                <TaskList
                  key={tasks[0].indicatorId}
                  type="INDICATOR"
                  taskType={'OBVIOUS'}
                  selected={selectedObvious}
                  select={selectObviousTask}
                  disableSelect={
                    selectedGeneral.length > 0 || selectedOther.length > 0
                  }
                  {...{
                    tasks,
                    planId,
                    userId,
                    skillType,
                  }}
                />
              ))}
              <TaskList
                isNotAssigned={true}
                type="INDICATOR"
                taskType="OBVIOUS"
                tasks={filteredNotAssignedTasks}
                selected={selectedObvious}
                select={selectObviousTask}
                disableSelect={
                  selectedGeneral.length > 0 || selectedOther.length > 0
                }
                userId={userId}
              />
            </>
          );
        }}
      </TaskFilter>
      <TaskFilter
        createTask={createTask_OTHER}
        groupedTasks={groupedTasks.OTHER.grouped}
        notAssignedTasks={groupedTasks.OTHER.notAssigned}
        title="Прочие материалы и задачи для развития"
        filterName={'other'}
      >
        {({ filteredGroupedTasks, filteredNotAssignedTasks }) => {
          return (
            <>
              {filteredGroupedTasks.map((tasks) => (
                <TaskList
                  key={tasks[0].indicatorId}
                  type="INDICATOR"
                  taskType={'OTHER'}
                  selected={selectedOther}
                  select={selectOtherTask}
                  disableSelect={
                    selectedGeneral.length > 0 || selectedObvious.length > 0
                  }
                  {...{
                    tasks,
                    planId,
                    userId,
                    skillType,
                  }}
                />
              ))}
              <TaskList
                isNotAssigned={true}
                type="INDICATOR"
                taskType="OTHER"
                tasks={filteredNotAssignedTasks}
                selected={selectedOther}
                select={selectOtherTask}
                disableSelect={
                  selectedGeneral.length > 0 || selectedObvious.length > 0
                }
                userId={userId}
              />
            </>
          );
        }}
      </TaskFilter>

      {planId && userId && (
        <IprEditSettings
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

export default memo(TasksSection);
