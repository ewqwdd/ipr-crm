import { User } from '@/entities/user';
import { Option } from '@/shared/types/Option';
import { SoftButton } from '@/shared/ui/SoftButton';
import { ChangeEvent, FC, memo, useCallback, useMemo, useState } from 'react';
import { MultiValue } from 'react-select';
import { getAllFilterOptions } from './helpers';
import SpecSelector from './SpecSelector';
import { Filters, initialFilters } from './constants';
import { UsersSelect } from '@/shared/ui/UsersSelect';
import AccessSelect from './AccessSelect';
import { TeamSelector } from '@/widgets/TeamSelector';

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

  const { teamsOptions, specsOptions } = useMemo(() => {
    if (!data) return { teamsOptions: [], specsOptions: [] };
    return getAllFilterOptions(data);
  }, [data]);

  const onChangeTeams = useCallback(
    (value: MultiValue<Option>) => updateFilters('teams', value),
    [updateFilters],
  );

  const onChangeUser = useCallback(
    (value?: number) => {
      updateFilters('userId', value ?? 'ALL');
    },
    [updateFilters],
  );

  const onChangeSpecs = useCallback(
    (value: MultiValue<Option>) => updateFilters('specs', value),
    [updateFilters],
  );

  const onChangeAccess = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      updateFilters('access', e.target.value);
    },
    [updateFilters],
  );

  const resetFilters = () => {
    updateFilters('teams', initialFilters.teams);
    updateFilters('userId', initialFilters.userId);
    updateFilters('specs', initialFilters.specs);
    updateFilters('access', initialFilters.access);
  };

  const changedFiltersCount = [
    filters.teams.length !== initialFilters.teams.length,
    filters.userId !== initialFilters.userId,
    filters.specs.length !== initialFilters.specs.length,
    filters.access !== initialFilters.access,
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <UsersSelect
              setValue={onChangeUser}
              users={data ?? []}
              value={filters.userId === 'ALL' ? undefined : filters.userId}
            />
          </div>
          <SpecSelector
            options={specsOptions}
            value={filters.specs}
            onChange={onChangeSpecs}
          />
          <AccessSelect
            access={filters.access}
            onChangeAccess={onChangeAccess}
          />
        </div>
      )}
    </div>
  );
};

export default memo(UsersFilters);
