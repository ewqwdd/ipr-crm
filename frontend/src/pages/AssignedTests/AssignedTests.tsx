import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import AssignedLists from './tabs/AssignedLists';
import FinishedList from './tabs/FinishedList';

const tabs = [
  {
    name: 'Назначенные',
    key: 'tests',
  },
  {
    name: 'Пройденные',
    key: 'finished',
  },
];

export default function AssignedTests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  return (
    <div className="px-8 py-10 flex flex-col h-full relative">
      <div className="flex justify-between">
        <Heading title="Назначено тесты" />
        <Tabs tabs={tabs} setCurrentTab={setTab} currentTab={activeTab} />
      </div>

      {activeTab === 'tests' && <AssignedLists />}
      {activeTab === 'finished' && <FinishedList />}
    </div>
  );
}
