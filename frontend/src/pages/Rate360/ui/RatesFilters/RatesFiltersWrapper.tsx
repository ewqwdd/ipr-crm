import { Rate } from '@/entities/rates';
import { FC, useCallback, useMemo } from 'react';
import RatesFilters from './RatesFilters';
import { initialFilters } from './constatnts';
import { Option } from '@/shared/types/Option';
import { getUniqueOptions } from './helpers';
import { MultiValue } from 'react-select';
import { DateObject } from 'react-multi-date-picker';
import { Filters, FiltersProgress, FiltersSkillType } from './types';

interface RatesFiltersWrapperProps {
  data?: Rate[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const RatesFiltersWrapper: FC<RatesFiltersWrapperProps> = ({
  data,
  filters,
  setFilters,
}) => {
  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

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
      handleFilterChange('progress', value as FiltersProgress),
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
      teamsOptions: getUniqueOptions(data, 'team'),
      specsOptions: getUniqueOptions(data, 'spec'),
      usersOptions: getUniqueOptions(data, 'user'),
    }),
    [data],
  );

  return (
    <div className="mt-6">
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
