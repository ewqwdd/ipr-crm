import { IprTable } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { useState } from 'react';
import {
  initialIprFilters,
  IprFilters as IprFiltersType,
} from './IprFilters/config';
import IprFilters from './IprFilters/IprFilters';

const LIMIT = 20;

export default function IprList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<IprFiltersType>(initialIprFilters);
  const { data, isFetching } = iprApi.useFindAllIprQuery({
    page,
    limit: LIMIT,
    skill: filters.skillType === 'ALL' ? undefined : filters.skillType,
    user: filters.userId === -1 ? undefined : filters.userId,
    teams:
      filters.teams.length > 0
        ? filters.teams.map((team) => team.value)
        : undefined,
    startDate: filters.period?.[0]?.toDate()?.toISOString(),
    endDate: filters.period?.[1]?.toDate()?.toISOString(),
  });

  return (
    <LoadingOverlay active={isFetching}>
      <div className="sm:px-8 py-6 sm:py-10 flex flex-col">
        <Heading
          title="Планы развития"
          description="Список планов развития"
          className="max-sm:px-4"
        />
        <IprFilters filters={filters} setFilters={setFilters} />
        {data && <IprTable ipr={data.data} isLoading={isFetching} />}
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
    </LoadingOverlay>
  );
}
