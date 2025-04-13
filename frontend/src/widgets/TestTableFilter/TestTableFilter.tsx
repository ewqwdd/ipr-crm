import { useState, useCallback } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import StaticSelectFilter from '@/pages/Rate360/ui/RatesFilters/StaticSelectFilter';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import PeriodSelector from '@/pages/Rate360/ui/RatesFilters/PeriodSelector';
import { DateObject } from 'react-multi-date-picker';
import debounce from 'lodash.debounce';
import {
  initialFilters,
  testStatusOptions,
  TestTableFilterType,
} from './helpers';

type TestTableFilterProps = {
  filters: TestTableFilterType;
  updateFilters: (key: keyof TestTableFilterType, value: unknown) => void;
};

export default function TestTableFilter({
  filters,
  updateFilters,
}: TestTableFilterProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState(filters.name);

  const resetFilters = () => {
    updateFilters('name', initialFilters.name);
    updateFilters('status', initialFilters.status);
    updateFilters('period', initialFilters.period);
    setSearchValue(initialFilters.name);
  };

  const changedFiltersCount = [
    filters.name !== initialFilters.name,
    filters.status !== initialFilters.status,
    filters.period !== initialFilters.period,
  ].filter(Boolean).length;

  const onChangeStatus = (value: string | number) => {
    updateFilters('status', value as TestTableFilterType['status']);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateFilters('name', value);
    }, 300),
    [updateFilters],
  );

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const onChangePeriod = (value?: DateObject | DateObject[]) =>
    updateFilters('period', value as DateObject[]);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <SoftButton className="relative" onClick={() => setIsOpen((s) => !s)}>
          Фильтры
          {changedFiltersCount !== 0 && (
            <span className="absolute top-[-6px] right-[-6px] flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-sky-500 justify-center items-center text-white text-xs">
                {changedFiltersCount}
              </span>
            </span>
          )}
        </SoftButton>
        {changedFiltersCount !== 0 && (
          <SoftButton
            onClick={() => {
              resetFilters();
              setIsOpen(false);
            }}
          >
            Сбросить
          </SoftButton>
        )}
      </div>
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm">
          <InputWithLabelLight
            label="Название"
            value={searchValue}
            onChange={onChangeSearch}
            placeholder="Поиск..."
          />
          <StaticSelectFilter
            label={'Статус'}
            options={testStatusOptions}
            onChange={onChangeStatus}
            value={filters.status}
          />
          <PeriodSelector onChange={onChangePeriod} value={filters.period} />
        </div>
      )}
    </div>
  );
}
