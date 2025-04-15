import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import AssignedList from './tabs/AssignedList';
import FinishedList from './tabs/FinishedList';

const tabs = [
  {
    name: 'Назначенные',
    key: 'surveys',
  },
  {
    name: 'Пройденные',
    key: 'finished',
  },
];

export default function AssignedSurveys() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  return (
    <div className="px-8 py-10 flex flex-col h-full relative">
      <div className="flex justify-between">
        <Heading title="Назначеные опросы" />
        <Tabs tabs={tabs} setCurrentTab={setTab} currentTab={activeTab} />
      </div>

      {activeTab === 'surveys' && <AssignedList />}
      {activeTab === 'finished' && <FinishedList />}
    </div>
  );
}
