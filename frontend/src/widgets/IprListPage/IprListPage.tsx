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
import { filterService } from '@/shared/lib/filterService';
import { SoftButton } from '@/shared/ui/SoftButton';

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

  const { data, isFetching } = iprApi.useFindAllIprQuery(
    filterService.iprFiltersTransform(filters, page, LIMIT, type),
  );
  const [selected, setSelected] = useState<number[]>([]);

  const handleExport = () => {
    const url = new URL(import.meta.env.VITE_API_URL + '/ipr/export');
    const params = filterService.iprFiltersTransform(
      filters,
      page,
      LIMIT,
      type,
    );
    params.limit = undefined;
    params.page = undefined;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    window.open(url);
  };

  return (
    <LoadingOverlay active={isFetching} fullScereen>
      <div className="sm:px-8 py-6 sm:py-10 flex flex-col">
        <div className="flex justify-between">
          <Heading
            title="Планы развития"
            description="Список планов развития"
            className="max-sm:px-4"
          />
          <SoftButton onClick={handleExport} className="self-start">
            Экспорт
          </SoftButton>
        </div>
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
