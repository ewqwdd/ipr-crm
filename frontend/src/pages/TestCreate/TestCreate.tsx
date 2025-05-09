import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import SubmitTest from './SubmitTest';
import { testsApi } from '@/shared/api/testsApi';
import TestCreateAccess from './tabs/TestCreateAccess';
import TestCreateSettings from './tabs/TestCreateSettings';
import TestQuestionsCreate from './tabs/TestQuestionsCreate';
import TestScoreCreate from './tabs/TestScoreCreate';
import { testCreateTabs } from '@/entities/test';
import { useAppDispatch } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { useEffect } from 'react';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function TestCreate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || testCreateTabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  const [mutate, state] = testsApi.useCreateTestMutation();
  const isLoading = state.isLoading;
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(testCreateActions.clear());
    };
  }, []);

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      <div className="px-8 py-10 flex flex-col h-full relative">
        <div className="flex justify-between items-center">
          <Heading title="Создание теста" />
          <Tabs
            tabs={testCreateTabs}
            setCurrentTab={setTab}
            currentTab={activeTab}
          />
        </div>
        {activeTab === 'settings' && <TestCreateSettings />}
        {activeTab === 'access' && <TestCreateAccess />}
        {activeTab === 'questions' && <TestQuestionsCreate />}
        {activeTab === 'score-settings' && <TestScoreCreate />}
        <SubmitTest
          handleSubmit={mutate}
          state={state}
          errorMessage={'Ошибка при создании теста'}
          successMessage={'Тест успешно создан'}
        />
      </div>
    </LoadingOverlay>
  );
}
