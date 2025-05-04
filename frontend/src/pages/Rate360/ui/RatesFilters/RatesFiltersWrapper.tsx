import { FC, useCallback, useMemo } from 'react';
import RatesFilters from './RatesFilters';
import { initialFilters } from './constatnts';
import { Option } from '@/shared/types/Option';
import { MultiValue } from 'react-select';
import { DateObject } from 'react-multi-date-picker';
import { Filters, FiltersSkillType } from './types';
import { usersApi } from '@/shared/api/usersApi';
import { teamsApi } from '@/shared/api/teamsApi';
import { useAppSelector } from '@/app';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { universalApi } from '@/shared/api/universalApi';

interface RatesFiltersWrapperProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const RatesFiltersWrapper: FC<RatesFiltersWrapperProps> = ({
  filters,
  setFilters,
}) => {
  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const { data: users } = usersApi.useGetUsersQuery({});
  const { data: teams } = teamsApi.useGetTeamsQuery();
  const { data: specs } = universalApi.useGetSpecsQuery();
  const teamAccess = useAppSelector((state) => state.user.user?.teamAccess);
  const isAdmin = useIsAdmin();

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
    (value: MultiValue<Option>) => handleFilterChange('teams', value),
    [handleFilterChange],
  );

  const onChangeUser = useCallback(
    (value: string | number) => handleFilterChange('userId', value as number),
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

  const { teamsOptions, specsOptions, usersOptions } = useMemo(
    () => ({
      teamsOptions: (isAdmin
        ? teams?.list
        : teams?.list.filter((team) => teamAccess?.includes(team.id))
      )?.map((team) => ({
        value: team.id,
        label: team.name,
      })) as Option[],
      specsOptions: specs?.map((spec) => ({
        value: spec.id,
        label: spec.name,
      })) as Option[],
      usersOptions: (users?.users ?? []).map((user) => ({
        value: user.id,
        label: user.username,
      })) as Option[],
    }),
    [users, teams, teamAccess, isAdmin, specs],
  );

  return (
    <div className="">
      <RatesFilters
        teamsOptions={teamsOptions}
        specsOptions={specsOptions}
        usersOptions={usersOptions}
        filters={filters}
        resetFilters={resetFilters}
        onChangeSkillType={onChangeSkillType}
        onChangeProgress={onChangeProgress}
        onChangeTeams={onChangeTeams}
        onChangeSpec={onChangeSpec}
        onChangeUser={onChangeUser}
        onChangePeriod={onChangePeriod}
      />
    </div>
  );
};

export default RatesFiltersWrapper;
