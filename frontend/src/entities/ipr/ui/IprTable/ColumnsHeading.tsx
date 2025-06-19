export default function ColumnsHeading() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th scope="col">
          <span className="sr-only">Чекбокс</span>
        </th>
        <th
          scope="col"
          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
        >
          Имя пользователя
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Команда
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Новая
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          В работе
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          На проверке
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Готово
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Просрочено
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
        >
          Прогресс
        </th>
        <th
          scope="col"
          className="relative py-3.5 pl-3 pr-4 sm:pr-6 font-medium text-sm"
        >
          На доску
        </th>
      </tr>
    </thead>
  );
}
