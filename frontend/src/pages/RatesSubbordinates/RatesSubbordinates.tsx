import { Heading } from '@/shared/ui/Heading';
import { SelectAll } from '@/widgets/SelectAll';
import { Pagination } from '@/shared/ui/Pagination';
import { useEffect, useState } from 'react';
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

const LIMIT = 10;

export default function RatesSubbordinates() {
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<RateFilters>(initialRateFilters);

  const { data, isLoading, isFetching } =
    rate360Api.useGetSubbordinatesRatesQuery(
      transformRateFilters(filters, '', LIMIT, page),
    );

  useEffect(() => {
    setPage(1);
    setFilters(initialRateFilters);
  }, []);

  useEffect(() => {
    setPage(1);
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
            page={page}
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
