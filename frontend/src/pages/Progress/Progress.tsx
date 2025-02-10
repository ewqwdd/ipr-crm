import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import SelfRateTab from './ui/SelfRateTab/SelfRateTab';
import AssignedRatesTab from './ui/AssignedRatesTab/AssignedRatesTab';

const tabs = [
  {
    name: 'Самооценка 360',
    key: 'self-assessment',
  },
  {
    name: 'По другим пользователям',
    key: 'by-others',
  },
];

export default function Progress() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  console.log('activeTab', activeTab);

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabClassName="first:ml-4"
        tabs={tabs}
        setCurrentTab={setTab}
        currentTab={activeTab}
      />
      {activeTab === 'self-assessment' && <SelfRateTab />}
      {activeTab === 'by-others' && <AssignedRatesTab />}
    </div>
  );
}
