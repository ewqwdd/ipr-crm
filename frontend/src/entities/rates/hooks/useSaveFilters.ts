import { useEffect, useLayoutEffect, useRef } from 'react';
import { DateObject } from 'react-multi-date-picker';
import { RateFilters } from '@/features/rate/RatesFilters';
import { FiltersSkillType } from '@/features/rate/RatesFilters/types';

export const useSaveFilters = (
  filters: RateFilters,
  setFilters: React.Dispatch<React.SetStateAction<RateFilters>>,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
) => {
  const inited = useRef(false);

  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(searchParams.entries());
    const newFilters: Partial<RateFilters> = {
      curatorId: params.curatorId ? Number(params.curatorId) : 'ALL',
      hidden: params.hidden === 'true',
      period: params.period
        ? params.period.split(',').map((date) => new DateObject(date))
        : undefined,
      specId: params.specId ? Number(params.specId) : 'ALL',
      skillType: (params.skillType as FiltersSkillType) || 'ALL',
      status: (params.status as RateFilters['status']) || 'ALL',
      userId: params.userId ? Number(params.userId) : 'ALL',
      teams: params.teams ? JSON.parse(params.teams) : {},
    };
    if (params.page) {
      inited.current = true;
      setPage(Number(params.page));
    }
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (filters.curatorId && filters.curatorId !== 'ALL')
      newSearchParams.set('curatorId', String(filters.curatorId));
    if (filters.hidden) newSearchParams.set('hidden', String(filters.hidden));
    if (filters.period)
      newSearchParams.set(
        'period',
        filters.period.map((p) => p.toDate().toISOString()).join(','),
      );
    if (filters.specId && filters.specId !== 'ALL')
      newSearchParams.set('specId', String(filters.specId));
    if (filters.skillType && filters.skillType !== 'ALL')
      newSearchParams.set('skillType', String(filters.skillType));
    if (filters.status && filters.status !== 'ALL')
      newSearchParams.set('status', String(filters.status));
    if (filters.userId && filters.userId !== 'ALL')
      newSearchParams.set('userId', String(filters.userId));
    if (filters.teams)
      newSearchParams.set('teams', JSON.stringify(filters.teams));
    if (page !== 1) newSearchParams.set('page', String(page));

    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters, page]);
};
