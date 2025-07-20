import { Pagination } from '@/shared/ui/Pagination';
import { STATISTIC_LIMIT } from '../../config';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { TableHeading } from '@/widgets/TableHeading';
import { TableBody } from '@/widgets/TableBody';
import { useEffect, useMemo, useRef } from 'react';
import { rate360Api } from '@/shared/api/rate360Api';
import { usersService } from '@/shared/lib/usersService';
import { Link } from 'react-router';
import { useSearchState } from '@/shared/hooks/useSearchState';
import { initialUserFilters, UsersFilter } from '@/entities/user';
import { Progress } from '@/shared/ui/Progress';
import UsersFilters from '@/pages/Users/usersFilters';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useAppSelector } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { countRateProgress } from '@/entities/rates/model/countRateProgress';

export default function EvaluatorsProgress() {
  const { openModal } = useModal();

  const { data: users, isLoading } = usersApi.useGetUsersQuery();
  const user = useAppSelector((state) => state.user.user);

  const [filters, setFilters, inited] =
    useSearchState<UsersFilter>(initialUserFilters);
  const prevFilters = useRef<UsersFilter>();

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

  const { data, isFetching } = rate360Api.useGetEvaluatorsQuery({
    limit: STATISTIC_LIMIT,
    page,
    user: filters.user,
    ...filters.teams,
  });

  const usersSelectData = useMemo(() => {
    if (!users) return [];
    if (user?.role.name === 'admin') {
      return users.users;
    }
    return users?.users.filter((u) => user?.userAccess.includes(u.id));
  }, [users, user]);

  return (
    <div className="mt-6 flex flex-col 2xl:px-8 px-0">
      <div className="flex justify-between  px-3 sm:px-5 mb-4 flex-wrap gap-5">
        <UsersFilters
          data={usersSelectData}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div className="flex-1 overflow-x-auto">
        <LoadingOverlay active={isFetching || isLoading} className="h-full">
          <table className="w-full">
            <TableHeading
              headings={[
                'Пользователь',
                'Завершено',
                'Всего',
                'Общий прогресс',
                'Руководитель',
                'Колега',
                'Подчиненный',
                '',
              ]}
            />
            <TableBody
              data={data?.users ?? []}
              columnRender={[
                {
                  render: (item) => (
                    <Link
                      to={`/users/${item.id}`}
                      className="text-indigo-950 font-medium hover:text-indigo-800 transition-all"
                    >
                      {usersService.displayName(item)}
                    </Link>
                  ),
                },
                {
                  render: (item) => {
                    const ratesRated = item.ratesToEvaluate.reduce(
                      (acc, val) => {
                        const indicatorsCount =
                          val.rate360.competencyBlocks.flatMap((block) =>
                            block.competencies.flatMap(
                              (competency) => competency.indicators,
                            ),
                          ).length;
                        const userRates = val.rate360.userRates;
                        if (indicatorsCount === userRates.length) {
                          return acc + 1;
                        }
                        return acc;
                      },
                      0,
                    );

                    return <span className="text-gray-900">{ratesRated}</span>;
                  },
                },
                {
                  render: (item) => (
                    <span className="text-gray-900">
                      {item.ratesToEvaluate.length}
                    </span>
                  ),
                },
                {
                  render: (item) => {
                    const allRates = item.ratesToEvaluate.flatMap(
                      (rate) => rate.rate360.userRates,
                    );
                    const blocks = item.ratesToEvaluate.flatMap(
                      (rate) => rate.rate360.competencyBlocks,
                    );

                    const { percent } = countRateProgress(blocks, allRates);
                    return (
                      <div className="flex gap-2 items-center">
                        {(percent * 100).toFixed(0)}%
                        <Progress percent={percent} className="w-32" />
                      </div>
                    );
                  },
                },
                {
                  render: (item) => {
                    const curatorCount = item.ratesToEvaluate.reduce(
                      (acc, val) => {
                        if (val.type === 'CURATOR') {
                          return acc + 1;
                        }
                        return acc;
                      },
                      0,
                    );
                    return (
                      <span className="text-gray-700">{curatorCount}</span>
                    );
                  },
                },
                {
                  render: (item) => {
                    const curatorCount = item.ratesToEvaluate.reduce(
                      (acc, val) => {
                        if (val.type === 'TEAM_MEMBER') {
                          return acc + 1;
                        }
                        return acc;
                      },
                      0,
                    );
                    return (
                      <span className="text-gray-700">{curatorCount}</span>
                    );
                  },
                },
                {
                  render: (item) => {
                    const curatorCount = item.ratesToEvaluate.reduce(
                      (acc, val) => {
                        if (val.type === 'SUBORDINATE') {
                          return acc + 1;
                        }
                        return acc;
                      },
                      0,
                    );
                    return (
                      <span className="text-gray-700">{curatorCount}</span>
                    );
                  },
                },
                {
                  render: (item) => (
                    <button
                      className="font-medium text-violet-500 hover:text-violet-700 transition-all"
                      onClick={() =>
                        openModal('EVALUATOR_STATISTIC', { data: item })
                      }
                    >
                      Полная статистика
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
  );
}
