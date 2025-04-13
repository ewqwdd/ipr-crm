import { useAppDispatch } from '@/app';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';
import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { cva } from '@/shared/lib/cva';
import {
  SurveyCreateAccess,
  surveyCreateActions,
  surveyCreateTabs,
  SurveyQuestions,
  SurveySettings,
  SurveySubmit,
} from '@/entities/survey';
import { surveyApi } from '@/shared/api/surveyApi';

export default function SurveyEdit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || surveyCreateTabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = surveyApi.useGetSurveyAdminQuery(
    parseInt(id || '-1'),
  );
  const dispatch = useAppDispatch();
  const [mutate, state] = surveyApi.useUpdateSurveyMutation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      dispatch(surveyCreateActions.init({ survey: data }));
      setIsMounted(true);
    }
  }, [data, dispatch]);

  return (
    isMounted && (
      <div
        className={cva('px-8 py-10 flex flex-col h-full relative', {
          //   'animate-pulse pointer-events-none': state.isLoading,
        })}
      >
        <div className="flex justify-between items-center">
          <Heading title="Редактирование опроса" />
          <Tabs
            tabs={surveyCreateTabs}
            setCurrentTab={setTab}
            currentTab={activeTab}
          />
        </div>

        {activeTab === 'settings' && <SurveySettings />}
        {activeTab === 'questions' && <SurveyQuestions />}
        {activeTab === 'access' && <SurveyCreateAccess />}

        <SurveySubmit
          handleSubmit={mutate}
          state={state}
          errorMessage={'Ошибка при редактировании опроса'}
          successMessage={'Опрос успешно редактирован'}
        />
      </div>
    )
  );
}
