import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import { rate360StatistcTabs } from './config';
import Confirmations from './tabs/Confirmations/Confirmations';
import RatesFiltersWrapper, {
  initialRateFilters,
  RateFilters,
} from '@/features/rate/RatesFilters';
import { useSearchState } from '@/shared/hooks/useSearchState';
import { useEffect, useRef } from 'react';

export default function Rate360Statistic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || rate360StatistcTabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };
  const setPage = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const [filters, setFilters, inited] =
    useSearchState<RateFilters>(initialRateFilters);
  const prevFilters = useRef<RateFilters>();

  useEffect(() => {
    if (
      inited &&
      filters.page !== 1 &&
      prevFilters.current &&
      prevFilters.current.page === filters.page
    ) {
      setPage(1);
    }
    return () => {
      prevFilters.current = filters;
    };
  }, [filters]);

  return (
    <div className="py-6 sm:py-10 flex flex-col sm:h-full">
      <div className="sm:px-8 px-4">
        <div className="flex justify-between items-center ">
          <Heading title="Статистика оценок" />
          <Tabs
            tabs={rate360StatistcTabs}
            currentTab={activeTab}
            setCurrentTab={setTab}
          />
        </div>
        <RatesFiltersWrapper
          exclude={['status']}
          filters={filters}
          setFilters={setFilters}
          type="ALL"
        />
      </div>
      {activeTab === 'confirmations' && (
        <Confirmations setFilters={setFilters} filters={filters} />
      )}
    </div>
  );
}
