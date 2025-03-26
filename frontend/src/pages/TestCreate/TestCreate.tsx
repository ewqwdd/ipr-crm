import { TestAccess, TestSettings } from '@/entities/test';
import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import SubmitTest from './SubmitTest';
import TestQuestions from '@/entities/test/ui/TesCreate/TestQuestions/TestQuestions';
import TestScore from '@/entities/test/ui/TesCreate/TestScore/TestScore';
import { testsApi } from '@/shared/api/testsApi';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

const tabs = [
  {
    key: 'settings',
    name: 'Настройки',
  },
  {
    key: 'access',
    name: 'Доступ',
  },
  {
    key: 'questions',
    name: 'Вопросы',
  },
  {
    key: 'score-settings',
    name: 'Настройки оценки',
  },
];

export default function TestCreate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  const [, { isLoading }] = testsApi.useCreateTestMutation();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="px-8 py-10 flex flex-col h-full relative">
        <div className="flex justify-between items-center">
          <Heading title="Создание теста" />
          <Tabs tabs={tabs} setCurrentTab={setTab} currentTab={activeTab} />
        </div>
        {activeTab === 'settings' && <TestSettings />}
        {activeTab === 'access' && <TestAccess />}
        {activeTab === 'questions' && <TestQuestions />}
        {activeTab === 'score-settings' && <TestScore />}
        <SubmitTest />
      </div>
    </LoadingOverlay>
  );
}
