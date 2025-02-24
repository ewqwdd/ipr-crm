import { FC, memo, useMemo, useState } from 'react';
import { Task } from '@/entities/ipr/model/types';
import { Radio } from '@/shared/ui/Radio';
import { ActionBar } from './ActionBar';
import { TaskList } from './TaskList';

type TasksProps = {
  tasks?: Task[];
  loading?: boolean;
};

const filters = [
  { label: 'Все', key: 'ALL' },
  { label: 'Новая', key: 'TO_DO' },
  { label: 'В работе', key: 'IN_PROGRESS' },
  { label: 'Готово', key: 'DONE' },
];

const NoTasks = () => <p className="text-gray-400 py-3">Ничего не найдено</p>;

const Tasks: FC<TasksProps> = ({
  tasks,
  // loading // TODO: add loading
}) => {
  const [selectedGeneral, setSelectedGeneral] = useState<number[]>([]);
  const [selectedObvious, setSelectedObvious] = useState<number[]>([]);

  const [generalFilters, setGeneralFilters] = useState('ALL');
  const [obviousFilters, setObviousFilters] = useState('ALL');

  const handleGeneralFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralFilters(event.target.value);
  };

  const handleObviousFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObviousFilters(event.target.value);
  };

  const selectGeneralTask = (ids: number | number[]) => {
    setSelectedGeneral((prevSelected) => {
      const idArray = Array.isArray(ids) ? ids : [ids];

      if (idArray.every((id) => prevSelected.includes(id))) {
        return prevSelected.filter((taskId) => !idArray.includes(taskId));
      }

      return [
        ...prevSelected,
        ...idArray.filter((id) => !prevSelected.includes(id)),
      ];
    });
  };

  const selectObviousTask = (ids: number | number[]) => {
    setSelectedObvious((prevSelected) => {
      const idArray = Array.isArray(ids) ? ids : [ids];

      if (idArray.every((id) => prevSelected.includes(id))) {
        return prevSelected.filter((taskId) => !idArray.includes(taskId));
      }

      return [
        ...prevSelected,
        ...idArray.filter((id) => !prevSelected.includes(id)),
      ];
    });
  };

  const groupedTasks = useMemo(() => {
    return ['GENERAL', 'OBVIOUS'].reduce(
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
      {} as Record<'GENERAL' | 'OBVIOUS', Task[][]>,
    );
  }, [tasks]);

  console.log('groupedTasks => ', groupedTasks);

  const filteredGroupedCompetencies = groupedTasks.GENERAL.map((tasks) =>
    tasks.filter(
      (task) => generalFilters === 'ALL' || task.status === generalFilters,
    ),
  ).filter((tasks) => tasks.length > 0);

  const filteredGroupedObvious = groupedTasks.OBVIOUS.map((tasks) =>
    tasks.filter(
      (task) => obviousFilters === 'ALL' || task.status === obviousFilters,
    ),
  ).filter((tasks) => tasks.length > 0);

  console.log('selectedGeneral => ', selectedGeneral);

  return (
    <div>
      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 mb-5">
        <h3 className="font-semibold mb-4">
          Общие материалы и задачи для развития
        </h3>
        <div className="flex gap-6 mb-4">
          {filters.map(({ label, key }) => (
            <Radio
              key={key}
              name="general"
              value={key}
              checked={generalFilters === key}
              onChange={handleGeneralFilter}
            >
              {label}
            </Radio>
          ))}
        </div>
        {filteredGroupedCompetencies.map((tasks) => (
          <TaskList
            key={tasks[0]?.competencyId}
            competencyName={tasks[0]?.competency?.name}
            tasks={tasks}
            disableSelect={selectedObvious.length > 0}
            selected={selectedGeneral}
            select={selectGeneralTask}
          />
        ))}
        {filteredGroupedCompetencies?.length === 0 && <NoTasks />}
      </div>
      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 mb-5">
        <h3 className="font-semibold mb-4">Очевидные задачи</h3>
        <div className="flex gap-4 mb-4">
          {filters.map(({ label, key }) => (
            <Radio
              key={key}
              name="obvious"
              value={key}
              checked={obviousFilters === key}
              onChange={handleObviousFilter}
            >
              {label}
            </Radio>
          ))}
        </div>
        {filteredGroupedObvious?.map((tasks) => (
          <TaskList
            key={tasks[0]?.indicatorId}
            competencyName={tasks[0]?.indicator?.name}
            tasks={tasks}
            disableSelect={selectedGeneral.length > 0}
            selected={selectedObvious}
            select={selectObviousTask}
          />
        ))}
        {filteredGroupedObvious?.length === 0 && <NoTasks />}
      </div>
      <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <h3 className="font-semibold">Other</h3>
        <div className="mt-4">WIP</div>
      </div>
      <ActionBar selectedMaterials={[]} />
    </div>
  );
};

export default memo(Tasks);
