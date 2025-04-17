import { testsApi } from '@/shared/api/testsApi';
import AssignedTestItem from './AssignedTestItem';
import { EmptyState } from '@/shared/ui/EmptyState';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function AssignedLists() {
  const { data, isLoading } = testsApi.useGetAssignedTestsQuery();

  // TODO: replace loading

  return (
    <LoadingOverlay active={isLoading}>
      <div className="flex flex-col gap-1.5 mt-4 h-full">
        {data?.map((test) => <AssignedTestItem key={test.id} test={test} />)}
        {data?.length === 0 && <EmptyState />}
      </div>
    </LoadingOverlay>
  );
}
