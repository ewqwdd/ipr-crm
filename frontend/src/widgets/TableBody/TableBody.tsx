import { cva } from '@/shared/lib/cva';
import { ReactNode } from 'react';

type Render<T> = (data: T, index: number) => ReactNode;

interface TableBodyProps<T> {
  data: T[];
  columnRender: (
    | Render<T>
    | {
        render: Render<T>;
        className?: string;
      }
  )[];
  className?: string;
}
export default function TableBody<T>({
  data,
  columnRender,
  className,
}: TableBodyProps<T>) {
  return (
    <tbody className={cva('bg-white', className)}>
      {data.map((row, index) => (
        <tr
          key={index}
          className={cva({
            'bg-gray-50': index % 2 === 0,
          })}
        >
          {columnRender.map((column, i) => (
            <td
              key={i}
              className={cva(
                'whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center',
                typeof column !== 'object' ? '' : column.className,
              )}
            >
              {typeof column === 'function'
                ? column(row, index)
                : column.render(row, index)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
