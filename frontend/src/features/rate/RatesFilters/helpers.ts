import { Rate } from '@/entities/rates';
import { Option } from '@/shared/types/Option';
import { Filters } from './types';

export const getChangedFilters = (
  initialFilters: Filters,
  currentFilters: Filters,
) => {
  const changedFilters = (
    Object.keys(initialFilters) as Array<keyof Filters>
  ).filter((key) => {
    if (key === 'page') return false;
    if (key === 'status' && currentFilters.status === 'NOT_CONFIRMED')
      return false;
    return (
      JSON.stringify(initialFilters[key] ?? '') !==
      JSON.stringify(currentFilters[key] ?? '')
    );
  });

  return {
    changedFiltersCount: changedFilters.length,
  };
};

export const getUniqueOptions = <T extends keyof Rate>(
  data: Rate[] | undefined,
  key: T,
): Option[] => {
  if (!data) return [];

  const seenIds = new Set<number>();
  return data
    .filter((rate) => {
      const entity = rate[key] as
        | { id: number; name?: string; username?: string }
        | undefined;
      if (!entity || seenIds.has(entity.id)) return false;
      seenIds.add(entity.id);
      return true;
    })
    .map((rate) => {
      const entity = rate[key] as {
        id: number;
        name?: string;
        username?: string;
      };
      return {
        value: entity.id,
        label: 'username' in entity ? entity.username! : entity.name!,
      };
    });
};

export const filterByUserId = (rate: Rate, userId: Filters['userId']) => {
  return userId === 'ALL' || Number(rate.user.id) === Number(userId);
};

export const filterBySpecId = (rate: Rate, specId: Filters['specId']) => {
  return specId === 'ALL' || Number(rate.spec.id) === Number(specId);
};

export const filterByProgress = (rate: Rate, progress: Filters['status']) => {
  if (progress === 'ALL') return true;
  const isCompleted = progress === 'COMPLETED' && rate.finished;
  const isInProgress = progress === 'NOT_COMPLETED' && !rate.finished;
  return isCompleted || isInProgress;
};

export const filterBySkillType = (
  rate: Rate,
  skillType: Filters['skillType'],
) => {
  return skillType === 'ALL' || rate.type === skillType;
};

export const filterByPeriod = (rate: Rate, period: Filters['period']) => {
  if (!period) return true;

  const [start, end] = period;
  if (!start || !end) return false;
  const rateStart = rate.startDate ? new Date(rate.startDate) : null;
  const rateEnd = rate.endDate ? new Date(rate.endDate) : null;

  const matchesStart = start && rateStart ? rateStart >= start.toDate() : false;
  const matchesEnd = end && rateEnd ? rateEnd <= end.toDate() : false;

  return matchesStart || matchesEnd;
};
