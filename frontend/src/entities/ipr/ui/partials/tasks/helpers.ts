import { Task, TaskStatus } from '@/entities/ipr/model/types';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export const formatDate = (date?: string | null) => {
  if (!date) return 'Не указано';
  const updatedDate = new Date(date);
  const day = updatedDate.getDate().toString().padStart(2, '0');
  const month = (updatedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = updatedDate.getFullYear();
  return `${day}.${month}.${year}`;
};

export const filterTasksByStatus = (
  tasksGroup: Task[][],
  filter: TaskStatus | 'ALL',
) =>
  tasksGroup
    .map((tasks) =>
      tasks.filter((task) => filter === 'ALL' || task.status === filter),
    )
    .filter((tasks) => tasks.length > 0);

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
