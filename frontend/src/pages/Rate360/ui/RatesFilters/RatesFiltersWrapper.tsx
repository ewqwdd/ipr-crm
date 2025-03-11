import { Rate } from '@/entities/rates';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import RatesFilters from './RatesFilters';
import { initialFilters, RateProgress } from './constatnts';
import { Option } from '@/shared/types/Option';
import {
  filterByPeriod,
  filterByProgress,
  filterBySkillType,
  filterBySpecId,
  filterByTeam,
  filterByUserId,
  getUniqueOptions,
} from './helpers';
import { MultiValue } from 'react-select';
import { DateObject } from 'react-multi-date-picker';

interface RatesFiltersWrapperProps {
  children: (filteredData: Rate[]) => ReactNode;
  data?: Rate[];
}

export type FiltersSkillType = 'ALL' | Rate['type'];
export type FiltersProgress = 'ALL' | RateProgress;

export type Filters = {
  teams: MultiValue<Option>;
  userId: number | 'ALL';
  specId: number | 'ALL';
  progress: FiltersProgress;
  status?: string;
  skillType: FiltersSkillType;
  period?: DateObject[];
};

const RatesFiltersWrapper: FC<RatesFiltersWrapperProps> = ({
  children,
  data,
}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

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

  const filteredData: Rate[] = useMemo(() => {
    if (!data) return [];
    return data.filter((rate: Rate) => {
      return (
        filterByTeam(rate, filters.teams) &&
        filterByUserId(rate, filters.userId) &&
        filterBySpecId(rate, filters.specId) &&
        filterBySkillType(rate, filters.skillType) &&
        filterByProgress(rate, filters.progress) &&
        filterByPeriod(rate, filters.period)
      );
    });
  }, [
    data,
    filters.teams,
    filters.progress,
    filters.skillType,
    filters.specId,
    filters.userId,
    filters.period,
  ]);

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
      {children(filteredData)}
    </div>
  );
};

export default RatesFiltersWrapper;
