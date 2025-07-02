import { RateFilters } from '@/features/rate/RatesFilters';
import { RateFiltersDto } from '@/shared/api/rate360Api';

const LIMIT = 8;

export const transformFiltersToParams = (
  filters: RateFilters,
  page?: number,
): RateFiltersDto => ({
  page,
  limit: LIMIT,
  status: filters.status === 'ALL' ? undefined : filters.status,
  specId: filters.specId === 'ALL' ? undefined : filters.specId,
  skill: filters.skillType === 'ALL' ? undefined : filters.skillType,
  user: filters.userId === 'ALL' ? undefined : filters.userId,
  ...filters.teams,
  startDate: filters.period?.[0]?.toDate()?.toISOString(),
  endDate: filters.period?.[1]?.toDate()?.toISOString(),
  hidden: !!filters.hidden,
  includeWhereEvaluatorCurator: true,
});
