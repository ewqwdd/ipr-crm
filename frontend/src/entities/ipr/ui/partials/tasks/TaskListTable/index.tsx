import { FC, ReactNode } from 'react';
import { TaskListTableHeader } from './TaskListTableHeader';

interface TaskListTableProps {
  children: ReactNode | ReactNode[];
}

const TaskListTable: FC<TaskListTableProps> = ({ children }) => {
  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg pb-[14px]">
      <table className="max-sm:min-w-96 max-xl:min-w-[880px] xl:w-full divide-y divide-gray-300">
        <TaskListTableHeader />
        <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
