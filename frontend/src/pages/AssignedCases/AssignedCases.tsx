import { caseApi } from '@/shared/api/caseApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import AssignedCasesTab from './tabs/AssignedCasesTab';
import FinishedCasesTab from './tabs/FinishedCasesTab';

const tabs = [
  {
    name: 'Назначенные',
    key: 'assigned',
  },
  {
    name: 'Пройденные',
    key: 'finished',
  },
];

export default function AssignedCases() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };
  const { data, isLoading } = caseApi.useGetAssignedCasesQuery();

  return (
    <LoadingOverlay fullScereen active={isLoading}>
      <div className="sm:px-8 sm:py-10 p-3 flex flex-col h-full relative">
        <div className="flex justify-between max-sm:pr-12 max-sm:flex-col mb-6">
          <Heading title="Назначено прохождение кейсов" />
          <Tabs tabs={tabs} setCurrentTab={setTab} currentTab={activeTab} />
        </div>
        {activeTab === 'assigned' && <AssignedCasesTab cases={data || []} />}
        {activeTab === 'finished' && <FinishedCasesTab cases={data || []} />}
      </div>
    </LoadingOverlay>
  );
}
