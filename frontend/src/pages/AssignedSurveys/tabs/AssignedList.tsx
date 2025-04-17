import { EmptyState } from '@/shared/ui/EmptyState';
import { surveyApi } from '@/shared/api/surveyApi';
import AssignedSurveyItem from './AssignedSurveyItem';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function AssignedList() {
  const { data, isLoading } = surveyApi.useGetAssignedSurveysQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="flex flex-col gap-1.5 mt-4 h-full">
        {data?.map((survey) => (
          <AssignedSurveyItem key={survey.id} survey={survey} />
        ))}
        {data?.length === 0 && <EmptyState />}
      </div>
    </LoadingOverlay>
  );
}
