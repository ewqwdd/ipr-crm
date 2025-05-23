import { surveyApi } from '@/shared/api/surveyApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { Link } from 'react-router';
import SurveyTable from './table/SurveyTable';

export default function Surveys() {
  const { data, isFetching } = surveyApi.useGetSurveysQuery();

  return (
    <div className="sm:px-8 sm:py-10 py-3 flex flex-col h-full relative">
      <div className="flex justify-between items-center max-sm:pr-16 pl-3">
        <Heading title="Опросы" />
        <Link to="/surveys/create">
          <PrimaryButton className="self-start">
            Создать новый опрос
          </PrimaryButton>
        </Link>
      </div>

      <LoadingOverlay active={isFetching}>
        <SurveyTable surveys={data ?? []} isFetching={isFetching} />
      </LoadingOverlay>
    </div>
  );
}
