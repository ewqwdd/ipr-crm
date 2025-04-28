import { formatDate } from '@/entities/ipr/ui/partials/tasks/helpers';
import { iprApi } from '@/shared/api/iprApi';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { Progress } from '@/shared/ui/Progress';
import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { Link } from 'react-router';

const LIMIT = 20;

export default function IprUserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = iprApi.useFindUserIprsQuery({
    limit: LIMIT,
    page,
  });

  return (
    <LoadingOverlay active={isLoading}>
      <div className="min-[1440px]:px-8 py-6 sm:py-10 flex flex-col">
        <Heading
          title="Планы развития"
          description="Список ваших планов развития"
          className="max-[1440px]:px-8 max-sm:px-4"
        />
        <div className="max-sm:max-w-full overflow-x-auto">
          <table className="sm:min-w-full divide-y divide-gray-300 mt-10">
            <TableHeading
              headings={[
                '',
                'Спец-я',
                'Навык',
                'Дата',
                'Новая',
                'В работе',
                'На проверке',
                'Готово',
                'Просрочено',
                'Прогресс',
                '',
              ]}
            />
            {data?.data ? (
              <TableBody
                data={data.data}
                columnRender={[
                  {
                    render: (item) => (
                      <span className="text-gray-900">{item.id}</span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="text-violet-500 font-medium">
                        {item.rate360?.spec.name}
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="text-gray-900">
                        {item.rate360?.type}
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="font-medium">
                        {formatDate(item.startDate)}
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span>
                        {item.tasks.filter((t) => t.status === 'TO_DO').length}
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span>
                        {
                          item.tasks.filter((t) => t.status === 'IN_PROGRESS')
                            .length
                        }
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span>
                        {
                          item.tasks.filter((t) => t.status === 'IN_REVIEW')
                            .length
                        }
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span>
                        {
                          item.tasks.filter((t) => t.status === 'COMPLETED')
                            .length
                        }
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="text-red-500">
                        {
                          item.tasks.filter(
                            (t) =>
                              t.deadline && new Date(t.deadline) < new Date(),
                          ).length
                        }
                      </span>
                    ),
                  },
                  {
                    render: (item) => {
                      const percent =
                        item.tasks.length > 0
                          ? item.tasks.filter((t) => t.status === 'COMPLETED')
                              .length / item.tasks.length
                          : 1;
                      return (
                        <div className="flex items-center gap-2 justify-center">
                          <Progress percent={percent} className="min-w-20" />
                          <span className="min-w-10">
                            {Math.round(percent * 100)}%
                          </span>
                        </div>
                      );
                    },
                  },
                  {
                    render: (item) => (
                      <Link
                        to={'/ipr/user/' + item.id}
                        className="font-medium text-violet-500 hover:text-violet-700 transition-all"
                      >
                        <ArrowRightIcon className="size-5" />
                      </Link>
                    ),
                  },
                ]}
              />
            ) : null}
          </table>
          {data?.data.length === 0 && <EmptyState />}
        </div>
        {data?.total && data?.total > 0 && (
          <Pagination
            limit={LIMIT}
            page={page}
            count={data?.total}
            setPage={setPage}
          />
        )}
      </div>
    </LoadingOverlay>
  );
}
