import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import SelfRateTab from './ui/SelfRateTab/SelfRateTab';
import AssignedRatesTab from './ui/AssignedRatesTab/AssignedRatesTab';
import ConfirmListTab from './ui/ConfirmListTab/ConfirmListTab';

const tabs = [
  {
    name: 'Самооценка 360',
    key: 'self-assessment',
  },
  {
    name: 'По другим пользователям',
    key: 'by-others',
  },
  {
    name: 'Утвердить список',
    key: 'confirm-list',
  },
];

export default function Progress() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

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
      {activeTab === 'confirm-list' && <ConfirmListTab />}
    </div>
  );
}
