import { FC, ReactNode } from 'react';
interface TableHeaderCellProps {
  text: ReactNode;
}

export const TableHeaderCell: FC<TableHeaderCellProps> = ({ text }) => {
  return (
    <th
      scope="col"
      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
    >
      {text}
      {/* <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
          Icon for sort
        </span> */}
    </th>
  );
};
