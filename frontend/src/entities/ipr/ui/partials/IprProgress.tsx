import { Card } from '@/shared/ui/Card';
import { Ipr } from '../../model/types';
import { Progress } from '@/shared/ui/Progress';
import { memo } from 'react';
import { Badge } from '@/shared/ui/Badge';
import { Link } from 'react-router';
import { ExternalLinkIcon } from '@heroicons/react/outline';

interface IprProgressProps {
  ipr?: Ipr;
}

const titleStyles = 'text-sm font-medium text-gray-900';
const subTitleStyles = 'text-gray-600 font-normal';

export default memo(function IprProgress({ ipr }: IprProgressProps) {
  const tasksCompleted =
    ipr?.tasks.filter((t) => t.status === 'COMPLETED') || [];
  const tasksInReview =
    ipr?.tasks.filter((t) => t.status === 'IN_REVIEW') || [];
  const tasksInProgress =
    ipr?.tasks.filter((t) => t.status === 'IN_PROGRESS') || [];
  const tasksToDo = ipr?.tasks.filter((t) => t.status === 'TO_DO') || [];

  const percent = ipr?.tasks ? tasksCompleted.length / ipr?.tasks.length : 0;

  return (
    <Card className="[&>div]:flex gap-2 [&>div]:flex-col">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Ваш прогресс: </h2>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Progress percent={percent} className="min-w-20" />
          <p className="text-sm text-gray-500">{Math.round(percent * 100)}%</p>
        </div>
        <div className="flex gap-4 items-center">
          <p className={titleStyles}>
            К выполнению:
            <span className={subTitleStyles}> {tasksToDo.length}</span>
          </p>
          <p className={titleStyles}>
            В работе:
            <span className={subTitleStyles}> {tasksInProgress.length}</span>
          </p>
          <p className={titleStyles}>
            На проверке:
            <span className={subTitleStyles}> {tasksInReview.length}</span>
          </p>
          <p className={titleStyles}>
            Выполнено:
            <span className={subTitleStyles}> {tasksCompleted.length}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-4 justify-end mt-3">
        <Badge color="gray">
          <p className={titleStyles}>Всего задач: {ipr?.tasks.length}</p>
        </Badge>
        <Badge color="red">
          <p className={titleStyles}>
            Просрочено:
            <span className={subTitleStyles}>
              {' '}
              {tasksInProgress.filter(
                (task) => task.deadline && new Date(task.deadline) < new Date(),
              ).length +
                tasksToDo.filter(
                  (task) =>
                    task.deadline && new Date(task.deadline) < new Date(),
                ).length}
            </span>
          </p>
        </Badge>
      </div>
      <Link to={'/360rate/report/' + ipr?.rate360Id} className="self-end mt-4">
        <Badge color="blue">
          360° отчет <ExternalLinkIcon className="size-5 inline-block" />
        </Badge>
      </Link>
    </Card>
  );
});
