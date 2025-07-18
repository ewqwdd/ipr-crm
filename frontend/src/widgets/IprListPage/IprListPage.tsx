import { IprTable } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { useEffect, useRef, useState } from 'react';
import {
  initialIprFilters,
  IprFilters as IprFiltersType,
} from './IprFilters/config';
import IprFilters from './IprFilters/IprFilters';
import { IprListPageType } from './config';
import IprListSettings from './IprListSettings';
import { useSearchState } from '@/shared/hooks/useSearchState';

const LIMIT = 10;

interface IprListPageProps {
  type?: IprListPageType;
}

export default function IprListPage({ type }: IprListPageProps) {
  const [filters, setFilters, inited] =
    useSearchState<IprFiltersType>(initialIprFilters);
  const prevFilters = useRef<IprFiltersType>();

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

  const { data, isFetching } = iprApi.useFindAllIprQuery({
    page,
    limit: LIMIT,
    skill: filters.skillType === 'ALL' ? undefined : filters.skillType,
    user: filters.userId === -1 ? undefined : filters.userId,
    teams:
      filters.teams.length > 0
        ? filters.teams.map((team) =>
            typeof team.value === 'string' ? parseInt(team.value) : team.value,
          )
        : undefined,
    startDate: filters.period?.[0]?.toDate()?.toISOString(),
    endDate: filters.period?.[1]?.toDate()?.toISOString(),
    subbordinatesOnly: type === 'TEAM' ? true : undefined,
    deputyOnly: filters.deputyOnly,
  });
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <LoadingOverlay active={isFetching} fullScereen>
      <div className="sm:px-8 py-6 sm:py-10 flex flex-col">
        <Heading
          title="Планы развития"
          description="Список планов развития"
          className="max-sm:px-4"
        />
        <IprFilters type={type} filters={filters} setFilters={setFilters} />
        {data && (
          <IprTable
            ipr={data.data}
            isLoading={isFetching}
            selected={selected}
            setSelected={setSelected}
          />
        )}
        <div className="flex justify-between flex-col mt-4">
          {data && data.total > 0 && (
            <Pagination
              page={page}
              setPage={setPage}
              limit={LIMIT}
              count={data.total}
            />
          )}
        </div>
      </div>
      {selected.length > 0 && (
        <IprListSettings
          selected={selected}
          setSelected={setSelected}
          isLoading={isFetching}
        />
      )}
    </LoadingOverlay>
  );
}
