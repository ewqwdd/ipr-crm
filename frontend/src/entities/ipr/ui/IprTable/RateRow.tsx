import { cva } from '@/shared/lib/cva';
import { Ipr } from '../../model/types';
import { Link } from 'react-router';
import { Progress } from '@/shared/ui/Progress';
import { ArrowRightIcon, PencilAltIcon } from '@heroicons/react/outline';
import { Checkbox } from '@/shared/ui/Checkbox';
import { useCallback } from 'react';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';

interface RateRowProps {
  task: Ipr;
  index: number;
  selected?: number[];
  setSelected?: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function RateRow({
  index,
  task,
  selected,
  setSelected,
}: RateRowProps) {
  const toDoTasks = task.tasks.filter((task) => task.status === 'TO_DO');
  const inProgressTasks = task.tasks.filter(
    (task) => task.status === 'IN_PROGRESS',
  );
  const isAdmin = useIsAdmin();

  // const requiredTasks = task.tasks.filter(
  //   (task) => ['OBVIOUS', 'GENERAL'].includes(task.type) && task.onBoard,
  // );
  // const obviousTasksCompleted = requiredTasks.filter((task) =>
  //   ['COMPLETED', 'IN_REVIEW'].includes(task.status),
  // ).length;

  const inReviewTasks = task.tasks.filter(
    (task) => task.status === 'IN_REVIEW',
  );
  const tasksCompleted = task.tasks.filter((t) => t.status === 'COMPLETED');

  const percent = tasksCompleted.length / task.tasks.length || 0;

  const onSelectToggle = useCallback(
    () =>
      setSelected?.((prev) => {
        if (prev?.includes(task.id)) {
          return prev.filter((item) => item !== task.id);
        } else {
          return [...(prev || []), task.id];
        }
      }),
    [setSelected, task.id],
  );

  return (
    <tr
      className={cva({
        'bg-gray-50': index % 2 === 0,
      })}
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {isAdmin && (
          <Checkbox
            checked={selected?.includes(task.id)}
            onChange={onSelectToggle}
          />
        )}
      </td>

      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <Link
          className="font-medium text-gray-900  hover:text-violet-900 transition-all"
          to={'/users/' + task?.userId}
        >
          {task?.user?.firstName} {task?.user?.lastName}
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        <Link
          className="font-medium text-violet-500 hover:text-violet-700 transition-all"
          to={'/teams/' + task.rate360?.teamId}
        >
          {task.rate360?.team?.name}
        </Link>
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {toDoTasks.length}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {inProgressTasks.length}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {inReviewTasks.length}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {tasksCompleted.length}
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {
          [...inProgressTasks, ...toDoTasks].filter(
            (task) => task.deadline && new Date(task.deadline) < new Date(),
          ).length
        }
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        <div className="flex items-center gap-2 justify-center">
          <Progress percent={percent} className="min-w-20" />
          <span className="min-w-10">{Math.round(percent * 100)}%</span>
          <Link
            to={'/ipr/360/' + task.id}
            className="font-medium text-violet-500 hover:text-violet-700 transition-all ml3"
          >
            <PencilAltIcon className="w-5 h-5" />
          </Link>
        </div>
      </td>

      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center flex items-center justify-center">
        <Link
          to={'/board/' + task.userId}
          className="font-medium text-violet-500 hover:text-violet-700 transition-all"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </td>
    </tr>
  );
}
