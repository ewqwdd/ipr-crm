import { Task } from '@/entities/ipr/model/types';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, memo, useState } from 'react';
import { BoardFiltersType, initialFilters } from './constants';
import StaticSelectFilter from '@/shared/ui/StaticSelectFilter/StaticSelectFilter';
import PeriodSelector from '@/shared/ui/PeriodSelector/PeriodSelector';
import { DateObject } from 'react-multi-date-picker';
import { taskPriorityOptions } from '@/entities/ipr/ui/partials/tasks/constants';

interface BoardFiltersProps {
  filters: BoardFiltersType;
  updateFilters: (key: keyof BoardFiltersType, value: unknown) => void;
}

const BoardFilters: FC<BoardFiltersProps> = ({ filters, updateFilters }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const resetFilters = () => {
    updateFilters('priority', initialFilters.priority);
    updateFilters('period', initialFilters.period);
  };

  const changedFiltersCount = [
    filters.priority !== initialFilters.priority,
    filters.period !== initialFilters.period,
  ].filter(Boolean).length;

  const onChangePriority = (value: string | number) => {
    updateFilters('priority', value as Task['priority']);
  };

  const onChangePeriod = (value?: DateObject | DateObject[]) =>
    updateFilters('period', value as DateObject[]);

  return (
    <div className="max-sm:px-3">
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
          <StaticSelectFilter
            label="Важность"
            options={taskPriorityOptions}
            onChange={onChangePriority}
            value={filters.priority}
          />
          <PeriodSelector onChange={onChangePeriod} value={filters.period} />
        </div>
      )}
    </div>
  );
};

export default memo(BoardFilters);
