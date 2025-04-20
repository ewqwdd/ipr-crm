import { User } from '@/entities/user';
import TeamSelector from '@/pages/Rate360/ui/RatesFilters/TeamSelector';
import { Option } from '@/shared/types/Option';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { MultiValue } from 'react-select';
import { getAllFilterOptions } from './helpers';
import StaticSelectFilter from '@/pages/Rate360/ui/RatesFilters/StaticSelectFilter';
import SpecSelector from './SpecSelector';
import { Filters, initialFilters } from './constants';

interface UsersFiltersProps {
  data?: User[];
  filters: Filters;
  updateFilters: (key: keyof Filters, value: unknown) => void;
}

const UsersFilters: FC<UsersFiltersProps> = ({
  data,
  filters,
  updateFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { teamsOptions, specsOptions, usersOptions } = useMemo(() => {
    if (!data) return { teamsOptions: [], specsOptions: [], usersOptions: [] };
    return getAllFilterOptions(data);
  }, [data]);

  const onChangeTeams = useCallback(
    (value: MultiValue<Option>) => updateFilters('teams', value),
    [updateFilters],
  );

  const onChangeUser = useCallback(
    (value: string | number) => {
      updateFilters('userId', value as number);
    },
    [updateFilters],
  );

  const onChangeSpecs = useCallback(
    (value: MultiValue<Option>) => updateFilters('specs', value),
    [updateFilters],
  );

  const resetFilters = () => {
    updateFilters('teams', initialFilters.teams);
    updateFilters('userId', initialFilters.userId);
    updateFilters('specs', initialFilters.specs);
  };

  const changedFiltersCount = [
    filters.teams.length !== initialFilters.teams.length,
    filters.userId !== initialFilters.userId,
    filters.specs.length !== initialFilters.specs.length,
  ].filter(Boolean).length;

  return (
    <div className="mb-6 max-sm:mx-4">
      <div className="flex space-x-4">
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
          <SoftButton onClick={resetFilters}>Сбросить</SoftButton>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1300px]:grid-cols-3">
          <TeamSelector
            options={teamsOptions}
            value={filters.teams}
            onChange={onChangeTeams}
          />
          <StaticSelectFilter
            label="ФИО"
            options={usersOptions}
            onChange={onChangeUser}
            value={filters.userId}
          />
          <SpecSelector
            options={specsOptions}
            value={filters.specs}
            onChange={onChangeSpecs}
          />
        </div>
      )}
    </div>
  );
};

export default memo(UsersFilters);
