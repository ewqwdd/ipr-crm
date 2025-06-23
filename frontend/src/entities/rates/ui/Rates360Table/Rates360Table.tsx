import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SelectAll } from '@/widgets/SelectAll';
import RatesTable from './ui/RatesTable';
import { Pagination } from '@/shared/ui/Pagination';
import Settings from './ui/Settings';
import AddRate from '../AddRate/AddRate';
import { Modal } from '@/shared/ui/Modal';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app';
import { rate360Api } from '@/shared/api/rate360Api';
import { ratesActions } from '../../model/rateSlice';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Rates360TableType } from './types';
import RatesFiltersWrapper, {
  initialRateFilters,
  RateFilters,
} from '@/features/rate/RatesFilters';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';

const LIMIT = 10;

interface Rates360TableProps {
  type: Rates360TableType;
}

export default function Rates360Table({ type }: Rates360TableProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<RateFilters>(initialRateFilters);
  const dispatch = useAppDispatch();
  const isAdmin = useIsAdmin();

  const { data, isLoading, isFetching } = rate360Api.useGetRatesQuery({
    page,
    limit: LIMIT,
    specId: filters.specId === 'ALL' ? undefined : filters.specId,
    status: filters.status === 'ALL' ? undefined : filters.status,
    skill: filters.skillType === 'ALL' ? undefined : filters.skillType,
    user: filters.userId === 'ALL' ? undefined : filters.userId,
    teams:
      filters.teams.length > 0
        ? filters.teams.map((team) => Number(team.value))
        : undefined,
    startDate: filters.period?.[0]?.toDate()?.toISOString(),
    endDate: filters.period?.[1]?.toDate()?.toISOString(),
    hidden: !!filters.hidden,
    subbordinatesOnly: type === 'TEAM' ? true : undefined,
  });

  useEffect(() => {
    setPage(1);
    setFilters(initialRateFilters);
  }, [type]);

  useEffect(() => {
    setSelected([]);
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    dispatch(ratesActions.clear());
  };

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 sm:pt-10 py-6 flex flex-col h-full realtive">
        <div className="flex justify-between items-center max-sm:pr-14 max-sm:px-4">
          <Heading
            title="Командные отчёты"
            description={
              type === 'TEAM'
                ? 'Список 360 оценок подчиненных'
                : 'Список 360 оценок'
            }
          />
          {isAdmin && (
            <PrimaryButton onClick={() => setOpen(true)} className="self-start">
              Добавить
            </PrimaryButton>
          )}
        </div>
        <div className="flex-col gap-1 mt-6 relative mb-2">
          <RatesFiltersWrapper
            type={type}
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
        <Settings
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
