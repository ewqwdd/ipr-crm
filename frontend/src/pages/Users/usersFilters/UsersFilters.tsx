import { initialUserFilters, User, UsersFilter } from '@/entities/user';
import { SoftButton } from '@/shared/ui/SoftButton';
import React, { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import { UsersSelect } from '@/shared/ui/UsersSelect';
import AccessSelect from './AccessSelect';
import TeamsHierarchyFilter from '@/widgets/TeamsHierarchyFilter';

interface UsersFiltersProps {
  data?: User[];
  filters: UsersFilter;
  setFilters: React.Dispatch<React.SetStateAction<UsersFilter>>;
}

const UsersFilters: FC<UsersFiltersProps> = ({ data, filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = useCallback(
    (key: keyof UsersFilter, value: unknown) => {
      setFilters((prevFilters: UsersFilter) => ({
        ...prevFilters,
        [key]: value,
      }));
    },
    [setFilters],
  );

  const onChangeUser = useCallback(
    (value?: number) => {
      updateFilters('user', value);
    },
    [updateFilters],
  );

  const onChangeAccess = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      updateFilters('access', e.target.value);
    },
    [updateFilters],
  );

  const resetFilters = () => {
    updateFilters('teams', initialUserFilters.teams);
    updateFilters('user', undefined);
    updateFilters('access', initialUserFilters.access);
  };

  const changedFiltersCount = [
    filters.teams.product,
    filters.teams.department,
    filters.teams.direction,
    filters.teams.group,
    filters.user,
    filters.access !== initialUserFilters.access,
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
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1300px]:grid-cols-4">
          <div className="min-[1300px]:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <UsersSelect
              setValue={onChangeUser}
              users={data ?? []}
              value={filters.user}
            />
          </div>
          <AccessSelect
            access={filters.access}
            onChangeAccess={onChangeAccess}
          />
          <TeamsHierarchyFilter
            filters={filters.teams}
            onChange={(value) => updateFilters('teams', value)}
          />
        </div>
      )}
    </div>
  );
};

export default memo(UsersFilters);
