import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import { rate360StatistcTabs } from './config';
import Confirmations from './tabs/Confirmations/Confirmations';
import EvaluatorsProgress from './tabs/EvaluatorsProgress/EvaluatorsProgress';

export default function Rate360Statistic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || rate360StatistcTabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

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
        {activeTab === 'confirmations' && <Confirmations />}
        {activeTab === 'evaluators_progress' && <EvaluatorsProgress />}
      </div>
    </div>
  );
}
