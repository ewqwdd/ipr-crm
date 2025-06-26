import { FC, useCallback, useMemo } from 'react';
import RatesFilters from './RatesFilters';
import { initialFilters } from './constatnts';
import { Option } from '@/shared/types/Option';
import { DateObject } from 'react-multi-date-picker';
import { Filters, FiltersSkillType } from './types';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { universalApi } from '@/shared/api/universalApi';
import { Rates360TableType } from '@/entities/rates';
import { TeamsHierarchyFilterType } from '@/widgets/TeamsHierarchyFilter/types';

interface RatesFiltersWrapperProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  type: Rates360TableType;
  exclude?: (keyof Filters)[];
}

const RatesFiltersWrapper: FC<RatesFiltersWrapperProps> = ({
  filters,
  setFilters,
  type,
  exclude,
}) => {
  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const { data: users } = usersApi.useGetUsersQuery();
  const { data: specs } = universalApi.useGetSpecsQuery();

  const resetFilters = useCallback(() => {
    updateFilters(initialFilters);
  }, [updateFilters]);

  const handleFilterChange = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      updateFilters({ [key]: value });
    },
    [updateFilters],
  );

  const onChangeSkillType = useCallback(
    (value: string | number) =>
      handleFilterChange('skillType', value as FiltersSkillType),
    [handleFilterChange],
  );

  const onChangeProgress = useCallback(
    (value: string | number) =>
      handleFilterChange('status', value as Filters['status']),
    [handleFilterChange],
  );

  const onChangeTeams = useCallback(
    (value: TeamsHierarchyFilterType) => handleFilterChange('teams', value),
    [handleFilterChange],
  );

  const onChangeUser = useCallback(
    (value?: number) => handleFilterChange('userId', value ?? 'ALL'),
    [handleFilterChange],
  );

  const onChangeSpec = useCallback(
    (value: string | number) => handleFilterChange('specId', value as number),
    [handleFilterChange],
  );

  const onChangePeriod = useCallback(
    (value?: DateObject | DateObject[]) =>
      handleFilterChange('period', value as DateObject[]),
    [handleFilterChange],
  );

  const onChangeHidden = useCallback(
    (value: boolean) => handleFilterChange('hidden', value),
    [handleFilterChange],
  );

  const specsOptions = useMemo(
    () =>
      specs?.map((spec) => ({
        value: spec.id,
        label: spec.name,
      })) as Option[],
    [specs],
  );

  return (
    <div className="">
      <RatesFilters
        specsOptions={specsOptions}
        filters={filters}
        resetFilters={resetFilters}
        onChangeSkillType={onChangeSkillType}
        onChangeProgress={onChangeProgress}
        onChangeTeams={onChangeTeams}
        onChangeSpec={onChangeSpec}
        onChangeUser={onChangeUser}
        onChangePeriod={onChangePeriod}
        onChangeHidden={onChangeHidden}
        users={users?.users ?? []}
        type={type}
        exclude={exclude}
      />
    </div>
  );
};

export default RatesFiltersWrapper;
