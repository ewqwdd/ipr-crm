import { useAppDispatch } from '@/app';
import { ratesActions } from '@/entities/rates';
import AddRate from '@/entities/rates/ui/AddRate/AddRate';
import { rate360Api } from '@/shared/api/rate360Api';
import { Heading } from '@/shared/ui/Heading';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useEffect, useState } from 'react';
import RatesTable from './ui/RatesTable';
import Settings from './ui/Settings';
import RatesFiltersWrapper from './ui/RatesFilters';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { Filters } from './ui/RatesFilters/types';
import { initialFilters } from './ui/RatesFilters/constatnts';

const LIMIT = 20;

export default function Rate360() {
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching } = rate360Api.useGetRatesQuery({
    page,
    limit: LIMIT,
  });

  const handleClose = () => {
    setOpen(false);
    dispatch(ratesActions.clear());
  };

  useEffect(() => {
    setSelected([]);
  }, [data]);

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 sm:py-10 py-6 flex flex-col h-full realtive">
        <div className="flex justify-between items-center max-sm:pr-14 max-sm:px-4">
          <Heading title="Командные отчёты" description="Список 360 оценок" />
          <PrimaryButton onClick={() => setOpen(true)} className="self-start">
            Добавить
          </PrimaryButton>
        </div>
        <RatesFiltersWrapper
          filters={filters}
          setFilters={setFilters}
          data={data?.data}
        />
        <RatesTable
          selected={selected}
          data={data?.data}
          isLoading={isFetching}
          setSelected={setSelected}
        />
        <Pagination
          limit={LIMIT}
          page={page}
          count={data?.total}
          setPage={setPage}
        />
        <Settings selected={selected} setSelected={setSelected} />
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
