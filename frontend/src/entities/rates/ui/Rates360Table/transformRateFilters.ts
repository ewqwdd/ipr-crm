import { RateFilters } from '@/features/rate/RatesFilters';

export const transformRateFilters = (
  filters: RateFilters,
  type: string,
  limit?: number,
  page?: number,
) => ({
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
});
