import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import AssignedLists from './tabs/AssignedLists';
import FinishedList from './tabs/FinishedList';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { NotificationType } from '@/entities/notifications';

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

const notifTypes: NotificationType[] = ['TEST_ASSIGNED'];

export default function AssignedTests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  useReadNotifsOnClose(notifTypes);

  return (
    <div className="sm:px-8 sm:py-10 p-3 flex flex-col h-full relative">
      <div className="flex justify-between max-sm:pr-12 max-sm:flex-col">
        <Heading title="Назначено тесты" />
        <Tabs tabs={tabs} setCurrentTab={setTab} currentTab={activeTab} />
      </div>

      {activeTab === 'tests' && <AssignedLists />}
      {activeTab === 'finished' && <FinishedList />}
    </div>
  );
}
