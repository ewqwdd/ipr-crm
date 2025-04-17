import { EmptyState } from '@/shared/ui/EmptyState';
import FinishedListItem from './FinishedListItem';
import { surveyApi } from '@/shared/api/surveyApi';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function FinishedList() {
  const { data, isLoading } = surveyApi.useGetFinishedTestsForUserQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="flex flex-col gap-1.5 mt-4 h-full">
        {data?.map((survey) => (
          <FinishedListItem survey={survey} key={survey.id} />
        ))}
        {data?.length === 0 && <EmptyState />}
      </div>
    </LoadingOverlay>
  );
}
