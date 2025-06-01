import { rate360Api } from '@/shared/api/rate360Api';
import { dateService } from '@/shared/lib/dateService';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { SoftButton } from '@/shared/ui/SoftButton';
import { Rate360Progress } from '@/widgets/Rate360Progress';
import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentReportIcon,
} from '@heroicons/react/outline';
import { useState } from 'react';
import { Link } from 'react-router';

const LIMIT = 10;

export default function Rate360MeList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = rate360Api.useFindMyRatesQuery({
    page,
    limit: LIMIT,
  });

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      <div className="min-[1440px]:px-8 py-6 sm:py-10 flex flex-col">
        <Heading
          title="Командные отчёты"
          description="Список ваших оценок 360"
          className="max-[1440px]:px-8 max-sm:px-4"
        />
        <div className="max-sm:max-w-full overflow-x-auto">
          <table className="sm:min-w-full divide-y divide-gray-300 mt-2">
            <TableHeading
              headings={[
                '',
                'Команда',
                'Спец-я',
                'Навык',
                'Согласовано',
                'Согласовно куратором',
                'Прогресс',
                'Назначено',
                'Отчет',
              ]}
            />
            {data?.data ? (
              <TableBody
                data={data?.data}
                columnRender={[
                  {
                    render: (item) => (
                      <span className="text-gray-900">{item.id}</span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="text-violet-500 font-medium">
                        {item.team?.name ?? '-'}
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="text-gray-900">{item.spec.name}</span>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="text-gray-900">{item.type}</span>
                    ),
                  },
                  {
                    render: (item) => (
                      <div className="flex justify-center">
                        {item.userConfirmed ? (
                          <CheckCircleIcon className="size-5 text-green-500" />
                        ) : (
                          <Link
                            to="/progress?tab=confirm-list"
                            className="text-violet-500 font-medium"
                          >
                            Утвердить список
                          </Link>
                        )}
                      </div>
                    ),
                  },
                  {
                    render: (item) => (
                      <div className="flex justify-center">
                        {item.curatorConfirmed ? (
                          <CheckCircleIcon className="size-5 text-green-500" />
                        ) : (
                          <ClockIcon className="size-5 text-gray-500" />
                        )}
                      </div>
                    ),
                  },
                  {
                    render: (item) => <Rate360Progress rate={item} />,
                    className: 'text-center flex items-center gap-2',
                  },
                  {
                    render: (item) => (
                      <span>
                        {item.startDate &&
                          dateService.formatDate(item.startDate)}
                      </span>
                    ),
                  },
                  {
                    render: (item) =>
                      item.showReportToUser ? (
                        <Link to={`/360rate/report/${item.id}`}>
                          <SoftButton className="p-1.5 rounded-full">
                            <DocumentReportIcon className="size-4" />
                          </SoftButton>
                        </Link>
                      ) : (
                        <span className="text-gray-500">Нет доступа</span>
                      ),
                  },
                ]}
              />
            ) : null}
          </table>
          {data?.data.length === 0 && <EmptyState />}
        </div>
        {!!data && data?.total > 0 && (
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
