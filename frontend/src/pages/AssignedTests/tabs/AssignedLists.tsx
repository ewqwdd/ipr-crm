import { testsApi } from '@/shared/api/testsApi';
import AssignedTestItem from './AssignedTestItem';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function AssignedLists() {
  const { data, isLoading } = testsApi.useGetAssignedTestsQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="flex flex-col gap-1.5 mt-4">
        {data?.map((test) => <AssignedTestItem key={test.id} test={test} />)}
      </div>
    </LoadingOverlay>
  );
}
