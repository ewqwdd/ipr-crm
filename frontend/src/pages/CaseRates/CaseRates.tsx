import { useModal } from '@/app/hooks/useModal';
import { type CaseRateFilters as CaseRateFiltersType } from '@/entities/cases';
import { CaseRateFilters } from '@/features/case/CaseRateFilters';
import { caseApi } from '@/shared/api/caseApi';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { useSearchState } from '@/shared/hooks/useSearchState';
import { dateService } from '@/shared/lib/dateService';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import { ActionBar } from '@/widgets/ActionBar';
import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import { UsersIcon } from '@heroicons/react/outline';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

const PAGE_LIMIT = 10;

const initial: CaseRateFiltersType = {
  page: 1,
  limit: PAGE_LIMIT,
};

export default function CaseRates() {
  const [selected, setSelected] = useState<number[]>([]);
  const { openModal } = useModal();
  const isAdmin = useIsAdmin();
  const [mutate, { isLoading: deleteLoading }] =
    caseApi.useDeleteRatesMutation();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters, inited] =
    useSearchState<CaseRateFiltersType>(initial);
  const prevFilters = useRef<CaseRateFiltersType>();

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

  const { data, isLoading } = caseApi.useGetCaseRatesQuery(filters);

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 sm:py-10 px-4 py-6 flex flex-col sm:h-full">
        <div className="flex max-sm:flex-col-reverse max-sm:gap-2 items-start">
          <Heading
            title="Опросы по кейсам"
            description={'Список опросов по кейсам'}
          />
          <PrimaryButton onClick={() => openModal('CREATE_CASE_RATE')}>
            Добавить опрос
          </PrimaryButton>
        </div>
        <div className="flex-col gap-1 mt-6 relative mb-2">
          <SoftButton onClick={() => setShowFilters((prev) => !prev)}>
            Фильтры
          </SoftButton>
          {showFilters && (
            <CaseRateFilters filters={filters} setFilters={setFilters} />
          )}
        </div>
        <div className="max-sm:max-w-full overflow-x-auto">
          <table className="sm:w-full divide-y divide-gray-300 mt-2">
            <TableHeading
              headings={[
                '',
                'Оцениваемый',
                'Автор',
                'Дата',
                'Количество кейсов',
                'Средняя оценка',
                'Оценивающие',
                '',
              ]}
            />
            <TableBody
              data={data?.data || []}
              columnRender={[
                {
                  render: (item, i) =>
                    isAdmin ? (
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onChange={() =>
                          setSelected((prev) => {
                            if (prev.includes(item.id)) {
                              return prev.filter((id) => id !== item.id);
                            } else {
                              return [...prev, item.id];
                            }
                          })
                        }
                      />
                    ) : (
                      <span className="text-gray-900 font-medium">{i + 1}</span>
                    ),
                },
                {
                  render: (item) => (
                    <Link
                      className="text-indigo-500 font-medium hover:text-indigo-700 transition-all"
                      to={`/users/${item.user.id}`}
                    >
                      {item.user.username}
                    </Link>
                  ),
                },

                {
                  render: (item) =>
                    item.author ? (
                      <Link
                        className="text-indigo-500 font-medium hover:text-indigo-700 transition-all"
                        to={`/users/${item.author?.id}`}
                      >
                        {item.author.username}
                      </Link>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Без автора
                      </span>
                    ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-500 font-medium">
                      {item.startDate && dateService.formatDate(item.startDate)}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-900 font-medium">
                      {item.cases.length}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-900 font-medium">
                      {item.cases.length > 0
                        ? (
                            item.cases.reduce(
                              (acc, rate) => acc + (rate.avg ?? 0),
                              0,
                            ) / item.cases.length
                          ).toFixed(1)
                        : 'Не оценено'}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <SoftButton
                      onClick={() =>
                        openModal('CASE_EVALUATORS', { data: item })
                      }
                      className="size-10 p-0 rounded-full"
                    >
                      <UsersIcon className="size-5" />
                    </SoftButton>
                  ),
                },
                {
                  render: (item) => (
                    <Link
                      className="text-indigo-500 font-medium hover:text-indigo-700 transition-all"
                      to={`/case-report/${item.id}`}
                    >
                      Перейти
                    </Link>
                  ),
                },
              ]}
            />
          </table>
        </div>
        <Pagination
          limit={PAGE_LIMIT}
          page={page ?? 1}
          setPage={setPage}
          count={data?.total}
        />
        {selected.length > 0 && (
          <ActionBar
            clearSelected={() => setSelected([])}
            selected={selected}
            loading={deleteLoading}
            buttonsConfig={[
              {
                label: 'Удалить',
                onClick: () =>
                  openModal('CONFIRM', {
                    submitText: 'Удалить',
                    title: 'Удалить выбранные Оценки?',
                    onSubmit: async () => {
                      await mutate(selected);
                      setSelected([]);
                    },
                  }),
                danger: true,
              },
            ]}
          />
        )}
      </div>
    </LoadingOverlay>
  );
}
