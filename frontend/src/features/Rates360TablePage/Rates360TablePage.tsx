import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SelectAll } from '@/widgets/SelectAll';
import { Pagination } from '@/shared/ui/Pagination';
import { Modal } from '@/shared/ui/Modal';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/app';
import { rate360Api } from '@/shared/api/rate360Api';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Rates360TableType } from './types';
import RatesFiltersWrapper, {
  initialRateFilters,
  RateFilters,
} from '@/features/rate/RatesFilters';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { SoftButton } from '@/shared/ui/SoftButton';
import { ratesActions, RateSettings, RatesTable } from '@/entities/rates';
import AddRate from '@/entities/rates/ui/AddRate/AddRate';
import { Filters } from '../rate/RatesFilters/types';
import { useSearchState } from '@/shared/hooks/useSearchState';
import { filterService } from '@/shared/lib/filterService';
const LIMIT = 10;

interface Rates360TablePageProps {
  type: Rates360TableType;
}

export default function Rates360TablePage({ type }: Rates360TablePageProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isAdmin = useIsAdmin();
  const prevFilters = useRef<RateFilters>();

  const [filters, setFilters, inited] =
    useSearchState<Filters>(initialRateFilters);
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

  const { data, isLoading, isFetching } = rate360Api.useGetRatesQuery(
    filterService.rateFiltersTransform(filters, type, LIMIT, page),
  );

  useEffect(() => {
    setSelected([]);
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    dispatch(ratesActions.clear());
  };

  const handleExport = async () => {
    const url = new URL(import.meta.env.VITE_API_URL + '/rate360/export');
    const params = filterService.rateFiltersTransform(filters, type);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    window.open(url);
  };

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 sm:pt-10 py-6 flex flex-col h-full realtive">
        <div className="flex items-center max-sm:pr-14 max-sm:px-4">
          <Heading
            title="Командные отчёты"
            description={
              type === 'TEAM'
                ? 'Список 360 оценок подчиненных'
                : 'Список 360 оценок'
            }
          />
          {isAdmin && (
            <>
              <PrimaryButton
                onClick={() => setOpen(true)}
                className="self-start ml-auto"
              >
                Добавить
              </PrimaryButton>
              <SoftButton onClick={handleExport} className="ml-2 self-start">
                Экспортировать
              </SoftButton>
            </>
          )}
        </div>
        <div className="flex-col gap-1 mt-6 relative mb-2">
          <RatesFiltersWrapper
            type={type}
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
      <Modal
        open={open}
        setOpen={handleClose}
        title="Добавить 360 оценку"
        className="sm:max-w-7xl mx-3"
        footer={false}
      >
        <AddRate closeModal={handleClose} />
      </Modal>
    </LoadingOverlay>
  );
}
