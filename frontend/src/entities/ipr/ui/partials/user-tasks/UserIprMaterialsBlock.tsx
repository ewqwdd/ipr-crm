import { Task } from '@/entities/ipr/model/types';
import { Competency, Indicator } from '@/entities/skill';
import { ArchiveIcon } from '@heroicons/react/outline';
import { memo } from 'react';
import UserIprMaterial from './UserIprMaterial';

interface UserIprMaterialsBlockProps {
  tasks: Task[];
  competency?: Competency | null;
  indicator?: Indicator | null;
  iprId: number;
}

export default memo(function UserIprMaterialsBlock({
  tasks,
  competency,
  indicator,
  iprId,
}: UserIprMaterialsBlockProps) {
  let filtered;
  let title;

  if (competency) {
    filtered = tasks.filter((task) => task.competencyId === competency.id);
    title = competency.name;
  } else if (indicator) {
    filtered = tasks.filter((task) => task.indicatorId === indicator.id);
    title = indicator.name;
  } else {
    filtered = tasks.filter(
      (task) => task.competencyId === null && task.indicatorId === null,
    );
    title = 'Без привязки Индикатору';
  }

  if (!filtered.length) {
    return null;
  }

  return (
    <>
      <div className="mt-5 mb-3">
        <div className="flex space-x-2 items-center">
          <ArchiveIcon className="w-5 h-5 text-gray-500 max-sm:hidden" />
          <h3 className="font-medium">{title}</h3>
        </div>
      </div>
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg pb-[14px]">
        <table className="divide-y divide-gray-300 w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-500"
              >
                Название
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-500"
              >
                Тип
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-500"
              >
                Дедлайн
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-sm font-medium text-gray-500"
              >
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((task) => (
              <UserIprMaterial iprId={iprId} key={task.id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
