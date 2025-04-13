import { surveyApi } from '@/shared/api/surveyApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useNavigate } from 'react-router';
import SurveyTable from './table/SurveyTable';

export default function Surveys() {
  const navigate = useNavigate();
  const { data, isFetching } = surveyApi.useGetSurveysQuery();

  return (
    <div className="px-8 py-10 flex flex-col h-full relative">
      <div className="flex justify-between items-center">
        <Heading title="Опросы" />
        <PrimaryButton
          onClick={() => navigate('/surveys/create')}
          className="self-start"
        >
          Создать новый опрос
        </PrimaryButton>
      </div>

      <LoadingOverlay active={isFetching}>
        <SurveyTable surveys={data ?? []} isFetching={isFetching} />
      </LoadingOverlay>
    </div>
  );
}
