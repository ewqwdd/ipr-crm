import { RateFilters } from '@/features/rate/RatesFilters';
import { Checkbox } from '@/shared/ui/Checkbox';
import { memo } from 'react';

interface StatusFilterProps {
  filter: RateFilters['status'];
  setFilter: (status: RateFilters['status']) => void;
}

export default memo(function StatusFilter({
  filter,
  setFilter,
}: StatusFilterProps) {
  const handleUserChange = () => {
    if (filter === 'CONFIRMED_BY_USER') {
      setFilter('NOT_CONFIRMED');
    } else if (['NOT_CONFIRMED', 'ALL'].includes(filter)) {
      setFilter('CONFIRMED_BY_USER');
    } else if (filter === 'CONFIRMED') {
      setFilter('CONFIRMED');
    }
  };

  const handleCuratorChange = () => {
    if (filter === 'CONFIRMED') {
      setFilter('CONFIRMED_BY_USER');
    } else {
      setFilter('CONFIRMED');
    }
  };

  return (
    <div className="flex gap-4 items-center flex-wrap">
      <Checkbox
        title="Утверждено оцениваемым"
        onChange={handleUserChange}
        checked={['CONFIRMED_BY_USER', 'CONFIRMED'].includes(filter ?? '')}
      />
      <Checkbox
        title="Утверждено руководителем"
        onChange={handleCuratorChange}
        checked={filter === 'CONFIRMED'}
      />
    </div>
  );
});
