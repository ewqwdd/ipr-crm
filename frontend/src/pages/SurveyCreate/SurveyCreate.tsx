import { surveyCreateTabs } from '@/entities/survey/constants';
import { Heading } from '@/shared/ui/Heading';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import {
  SurveySettings,
  SurveySubmit,
  SurveyQuestions,
  SurveyCreateAccess,
} from '@/entities/survey';
import { surveyApi } from '@/shared/api/surveyApi';

export default function SurveyCreate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || surveyCreateTabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  const [mutate, state] = surveyApi.useCreateSurveyMutation();

  return (
    <div className="px-8 py-10 flex flex-col h-full relative">
      <div className="flex justify-between items-center">
        <Heading title="Создание опроса" />
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
        errorMessage={'Ошибка при создании опроса'}
        successMessage={'Опрос успешно создан'}
      />
    </div>
  );
}
