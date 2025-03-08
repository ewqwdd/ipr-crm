import { Task, TaskStatus, TaskType } from '@/entities/ipr/model/types';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export const groupTasksByType = (tasks?: Task[]) => {
  if (!tasks || tasks.length === 0) {
    return {
      GENERAL: { grouped: [], notAssigned: [] },
      OBVIOUS: { grouped: [], notAssigned: [] },
      OTHER: { grouped: [], notAssigned: [] },
    };
  }

  return ['GENERAL', 'OBVIOUS', 'OTHER'].reduce(
    (acc, type) => {
      const filteredTasks = tasks?.filter((task) => task.type === type) ?? [];

      const groupKey = type === 'GENERAL' ? 'competencyId' : 'indicatorId';

      const groupedByKey = filteredTasks.reduce<Record<number, Task[]>>(
        (grouped, task) => {
          const key = task[groupKey];
          if (key) {
            if (!grouped[key]) {
              grouped[key] = [];
            }
            grouped[key].push(task);
          }
          return grouped;
        },
        {},
      );

      const notAssignedTasks = filteredTasks.filter((task) => !task[groupKey]);

      return {
        ...acc,
        [type]: {
          grouped: Object.values(groupedByKey),
          notAssigned: notAssignedTasks,
        },
      };
    },
    {} as Record<
      'GENERAL' | 'OBVIOUS' | 'OTHER',
      { grouped: Task[][]; notAssigned: Task[] }
    >,
  );
};

export const getSelectedMaterials = (
  selectedGeneral: number[],
  selectedObvious: number[],
  selectedOther: number[],
): { selectedMaterials: number[]; selectedType?: TaskType } => {
  if (selectedGeneral.length > 0) {
    return { selectedMaterials: selectedGeneral, selectedType: 'GENERAL' };
  }

  if (selectedObvious.length > 0) {
    return { selectedMaterials: selectedObvious, selectedType: 'OBVIOUS' };
  }

  if (selectedOther.length > 0) {
    return { selectedMaterials: selectedOther, selectedType: 'OTHER' };
  }

  return { selectedMaterials: [], selectedType: undefined };
};

export const formatDate = (date?: string | null) => {
  if (!date) return 'Не указано';
  const updatedDate = new Date(date);
  const day = updatedDate.getDate().toString().padStart(2, '0');
  const month = (updatedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = updatedDate.getFullYear();
  return `${day}.${month}.${year}`;
};

export const filterTasksByStatus = <T extends Task[][] | Task[]>(
  tasksGroup: T,
  filter: TaskStatus | 'ALL',
) => {
  if (Array.isArray(tasksGroup[0])) {
    return (tasksGroup as Task[][])
      .map((tasks) =>
        tasks.filter((task) => filter === 'ALL' || task.status === filter),
      )
      .filter((tasks) => tasks.length > 0) as T;
  } else {
    return (tasksGroup as Task[]).filter(
      (task) => filter === 'ALL' || task.status === filter,
    ) as T;
  }
};

export const handleFilterChange =
  (setFilter: Dispatch<SetStateAction<TaskStatus>>) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value as TaskStatus);
  };

export const toggleTaskSelection =
  (setSelected: Dispatch<SetStateAction<number[]>>) =>
  (ids: number | number[]) => {
    setSelected((prevSelected) => {
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
