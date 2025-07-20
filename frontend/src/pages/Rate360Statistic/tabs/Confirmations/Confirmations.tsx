import RatesFiltersWrapper, {
  initialRateFilters,
  RateFilters,
} from '@/features/rate/RatesFilters';
import { rate360Api } from '@/shared/api/rate360Api';
import { $api } from '@/shared/lib/$api';
import { dateService } from '@/shared/lib/dateService';
import { usersService } from '@/shared/lib/usersService';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import StatusFilter from './StatusFilter';
import { transformFiltersToParams } from './confirmations.config';
import ExportConfirmations from './ExportConfirmations';
import { STATISTIC_LIMIT } from '../../config';
import { useSearchState } from '@/shared/hooks/useSearchState';

const initial: RateFilters = {
  ...initialRateFilters,
  status: 'NOT_CONFIRMED',
};

export default function Confirmations() {
  const [filters, setFilters, inited] = useSearchState<RateFilters>(initial);
  const prevFilters = useRef<RateFilters>();

  const page = filters.page;
  const setPage = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  useEffect(() => {
    if (
      inited &&
      filters.page !== 1 &&
      prevFilters.current &&
      prevFilters.current.page === filters.page
    ) {
      setPage(1);
    }
    return () => {
      prevFilters.current = filters;
    };
  }, [filters]);

  const setStatus = (status: RateFilters['status']) => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  const { data, isFetching } = rate360Api.useGetRatesQuery(
    transformFiltersToParams(filters, page),
  );

  const sendNotification = (rateId: number) => {
    $api
      .post('/rate360/notify', { ids: [rateId] })
      .then(() => {
        toast.success('Напоминание отправлено');
      })
      .catch(() => {
        toast.error('Не удалось отправить напоминание');
      });
  };

  return (
    <>
      <RatesFiltersWrapper
        exclude={['status']}
        filters={filters}
        setFilters={setFilters}
        type="ALL"
        initialFilters={initial}
      />
      <div className="mt-6 flex flex-col 2xl:px-8 px-0">
        <div className="flex justify-between  px-3 sm:px-5 mb-4 flex-wrap gap-5">
          <StatusFilter filter={filters.status} setFilter={setStatus} />
          <ExportConfirmations filters={filters} status={filters.status} />
        </div>
        <div className="flex-1 overflow-x-auto">
          <LoadingOverlay active={isFetching} className="h-full">
            <table className="w-full">
              <TableHeading
                headings={[
                  'Оцениваемый',
                  'Спец-я',
                  'Команда',
                  'Навыки',
                  'Назначен',
                  'Утвержден сотрудником',
                  'Утвержден руководителем',
                  'Напомнить',
                ]}
              />
              <TableBody
                data={data?.data ?? []}
                columnRender={[
                  {
                    render: (item) => (
                      <Link
                        to={`/users/${item.user.id}`}
                        className="text-indigo-950 font-medium hover:text-indigo-800 transition-all"
                      >
                        {usersService.displayName(item.user)}
                      </Link>
                    ),
                  },
                  {
                    render: (item) => (
                      <span className="text-gray-500 font-medium">
                        {item.spec.name}
                      </span>
                    ),
                  },
                  {
                    render: (item) => (
                      <Link
                        to={`/teams/${item.teamId}`}
                        className="text-violet-500 hover:text-violet-700 transition-all font-medium"
                      >
                        {item.team?.name ?? '-'}
                      </Link>
                    ),
                  },

                  {
                    render: (item) => (
                      <span className="text-gray-900">{item.type}</span>
                    ),
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
                    render: (item) => (
                      <div className="flex justify-center">
                        {item.userConfirmed ? (
                          <CheckCircleIcon className="size-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="size-5 text-red-500" />
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
                          <XCircleIcon className="size-5 text-red-500" />
                        )}
                      </div>
                    ),
                  },
                  {
                    render: (item) => (
                      <button
                        className="text-violet-500 font-medium"
                        onClick={() => sendNotification(item.id)}
                      >
                        Напомнить
                      </button>
                    ),
                  },
                ]}
              />
            </table>
          </LoadingOverlay>
        </div>
        <Pagination
          limit={STATISTIC_LIMIT}
          page={page}
          setPage={setPage}
          count={data?.total}
        />
      </div>
    </>
  );
}
