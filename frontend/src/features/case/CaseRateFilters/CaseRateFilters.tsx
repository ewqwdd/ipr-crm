import { type CaseRateFilters as CaseRateFiltersType } from '@/entities/cases';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useCallback } from 'react';

interface CaseRateFiltersProps {
  filters: CaseRateFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<CaseRateFiltersType>>;
}

export default function CaseRateFilters({
  filters,
  setFilters,
}: CaseRateFiltersProps) {
  const handleFilterChange = useCallback(
    <K extends keyof CaseRateFiltersType>(
      key: K,
      value: CaseRateFiltersType[K],
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters],
  );

  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-3">
      <InputWithLabelLight
        label="Пользователь"
        value={filters.username}
        onChange={(e) => handleFilterChange('username', e.target.value)}
      />
      <InputWithLabelLight
        label="Кейс"
        value={filters.case}
        onChange={(e) => handleFilterChange('case', e.target.value)}
      />
    </div>
  );
}
