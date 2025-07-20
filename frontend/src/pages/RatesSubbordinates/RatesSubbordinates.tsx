import { Heading } from '@/shared/ui/Heading';
import { SelectAll } from '@/widgets/SelectAll';
import { Pagination } from '@/shared/ui/Pagination';
import { useEffect, useRef, useState } from 'react';
import { rate360Api } from '@/shared/api/rate360Api';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import RatesFiltersWrapper, {
  initialRateFilters,
  RateFilters,
} from '@/features/rate/RatesFilters';
import {
  RateSettings,
  RatesTable,
  transformRateFilters,
} from '@/entities/rates';
import { useSearchState } from '@/shared/hooks/useSearchState';

const LIMIT = 10;

export default function RatesSubbordinates() {
  const [selected, setSelected] = useState<number[]>([]);
  const [filters, setFilters, inited] =
    useSearchState<RateFilters>(initialRateFilters);

  const { data, isLoading, isFetching } =
    rate360Api.useGetSubbordinatesRatesQuery(
      transformRateFilters(filters, '', LIMIT, filters.page),
    );

  const setPage = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const prevFilters = useRef<RateFilters>();

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

  useEffect(() => {
    setSelected([]);
  }, [data]);

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 sm:pt-10 py-6 flex flex-col h-full realtive">
        <div className="flex items-center max-sm:pr-14 max-sm:px-4">
          <Heading
            title="Командные отчёты"
            description={'Список 360 оценок подчиненных в других командах'}
          />
        </div>
        <div className="flex-col gap-1 mt-6 relative mb-2">
          <RatesFiltersWrapper
            type={'TEAM'}
            filters={filters}
            setFilters={setFilters}
            initialFilters={initialRateFilters}
          />
          <SelectAll
            data={data?.data ?? []}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
        <RatesTable
          selected={selected}
          data={data?.data}
          isLoading={isFetching}
          setSelected={setSelected}
        />
        {!!data?.total && data?.total > LIMIT && (
          <Pagination
            limit={LIMIT}
            page={filters.page}
            count={data?.total}
            setPage={setPage}
          />
        )}
        <RateSettings
          selected={selected}
          setSelected={setSelected}
          data={data?.data}
        />
      </div>
    </LoadingOverlay>
  );
}
