import { useAppDispatch } from '@/app';
import { testCreateTabs } from '@/entities/test';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { testsApi } from '@/shared/api/testsApi';
import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import TestCreateSettings from '../TestCreate/tabs/TestCreateSettings';
import TestCreateAccess from '../TestCreate/tabs/TestCreateAccess';
import TestQuestionsCreate from '../TestCreate/tabs/TestQuestionsCreate';
import TestScoreCreate from '../TestCreate/tabs/TestScoreCreate';
import SubmitTest from '../TestCreate/SubmitTest';
import { cva } from '@/shared/lib/cva';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function TestEdit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || testCreateTabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = testsApi.useGetTestAdminQuery(
    parseInt(id || '-1'),
  );
  const dispatch = useAppDispatch();
  const [mutate, state] = testsApi.useUpdateTestMutation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch(testCreateActions.init({ test: data }));
      setIsMounted(true);
    }
  }, [data, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(testCreateActions.clear());
    };
  }, [dispatch]);

  return (
    <LoadingOverlay active={isLoading || state.isLoading}>
      {isMounted && (
        <div
          className={cva('px-8 py-10 flex flex-col h-full relative', {
            'animate-pulse pointer-events-none': state.isLoading,
          })}
        >
          <div className="flex justify-between items-center">
            <Heading title="Редактирование теста" />
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
            errorMessage={'Ошибка при редактировании теста'}
            successMessage={'Тест успешно редактирован'}
          />
        </div>
      )}
    </LoadingOverlay>
  );
}
