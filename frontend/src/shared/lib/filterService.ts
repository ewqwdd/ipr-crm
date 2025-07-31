import { IprFilters } from '@/widgets/IprListPage/IprFilters/config';
import { IprFiltersDto } from '../api/iprApi';
import { RateFilters } from '@/features/rate/RatesFilters';
import { RateFiltersDto } from '../api/rate360Api';

export const filterService = {
  iprFiltersTransform: (
    filters: IprFilters,
    page: number,
    LIMIT: number,
    type?: string,
  ): IprFiltersDto => ({
    page,
    limit: LIMIT,
    skill: filters.skillType === 'ALL' ? undefined : filters.skillType,
    user: filters.userId === -1 ? undefined : filters.userId,
    teams:
      filters.teams.length > 0
        ? filters.teams.map((team) =>
            typeof team.value === 'string' ? parseInt(team.value) : team.value,
          )
        : undefined,
    startDate: filters.period?.[0]?.toDate()?.toISOString(),
    endDate: filters.period?.[1]?.toDate()?.toISOString(),
    subbordinatesOnly: type === 'TEAM' ? true : undefined,
    deputyOnly: filters.deputyOnly,
  }),

  rateFiltersTransform: (
    filters: RateFilters,
    type: string,
    limit?: number,
    page?: number,
  ): RateFiltersDto => ({
    page,
    limit,
    specId: filters.specId === 'ALL' ? undefined : filters.specId,
    status: filters.status === 'ALL' ? undefined : filters.status,
    skill: filters.skillType === 'ALL' ? undefined : filters.skillType,
    user: filters.userId === 'ALL' ? undefined : filters.userId,
    ...filters.teams,
    startDate: filters.period?.[0]?.toDate()?.toISOString(),
    endDate: filters.period?.[1]?.toDate()?.toISOString(),
    hidden: !!filters.hidden,
    subbordinatesOnly: type === 'TEAM' ? true : undefined,
    curatorId: filters.curatorId === 'ALL' ? undefined : filters.curatorId,
  }),
};
