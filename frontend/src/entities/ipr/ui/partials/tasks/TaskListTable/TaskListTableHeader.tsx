// TODO: Create a same table header for all components

import { FC } from 'react';

const headerItems = [
  'Материал',
  'Тип материала',
  'Важность',
  'Дедлайн',
  'Статус',
];

export const TaskListTableHeader: FC = () => {
  return (
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
};
