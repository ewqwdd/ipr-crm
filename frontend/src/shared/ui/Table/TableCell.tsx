import { FC, ReactNode } from 'react';
type TableCellProps = {
  text: ReactNode;
};

export const TableCell: FC<TableCellProps> = ({ text }) => {
  return (
    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
      {text}
    </td>
  );
};
