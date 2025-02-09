export default function ColumnsHeading() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
        >
          Оцениваемый
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Команда
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-90 text-center"
        >
          Спец-я
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Навыки
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Прогресс
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Статистика
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Назначен
        </th>
        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"></th>
      </tr>
    </thead>
  );
}
