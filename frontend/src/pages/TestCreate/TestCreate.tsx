import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import SubmitTest from './SubmitTest';
import { testsApi } from '@/shared/api/testsApi';
import { useEffect } from 'react';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';
import TestCreateAccess from './tabs/TestCreateAccess';
import TestCreateSettings from './tabs/TestCreateSettings';
import TestQuestionsCreate from './tabs/TestQuestionsCreate';
import TestScoreCreate from './tabs/TestScoreCreate';
import { testCreateTabs } from '@/entities/test';


export default function TestCreate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || testCreateTabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

    const [mutate, state] = testsApi.useCreateTestMutation();
    const isLoading = state.isLoading;

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading]);

  return (
    <div className="px-8 py-10 flex flex-col h-full relative">
      <div className="flex justify-between items-center">
        <Heading title="Создание теста" />
        <Tabs tabs={testCreateTabs} setCurrentTab={setTab} currentTab={activeTab} />
      </div>
      {activeTab === 'settings' && <TestCreateSettings />}
      {activeTab === 'access' && <TestCreateAccess />}
      {activeTab === 'questions' && <TestQuestionsCreate />}
      {activeTab === 'score-settings' && <TestScoreCreate />}
      <SubmitTest handleSubmit={mutate} state={state} errorMessage={'Ошибка при создании теста'} successMessage={'Тест успешно создан'} />
    </div>
  );
}
