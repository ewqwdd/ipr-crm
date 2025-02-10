export interface Column<T> {
  key: keyof T; // Поле объекта, соответствующее колонке
  title: string; // Заголовок колонки
  render?: (value: T[keyof T], record: T) => React.ReactNode; // Кастомный рендер
}

interface TableProps<T> {
  data: T[]; // Массив данных типа T
  columns: Column<T>[]; // Массив колонок, завязанных на T
  rowClick?: (row: T) => void;
}

export const Table: <T>({ data, columns }: TableProps<T>) => JSX.Element = ({
  data,
  columns,
  rowClick,
}) => {
  const rowClickHandler = (row: T) => {
    if (rowClick) {
      rowClick(row);
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="border border-gray-300 p-2 text-left font-semibold"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50"
              onClick={() => rowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="border border-gray-300 p-2"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
