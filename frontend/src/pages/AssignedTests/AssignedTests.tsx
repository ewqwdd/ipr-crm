import { testsApi } from '@/shared/api/testsApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import AssignedTestItem from './AssignedTestItem';

export default function AssignedTests() {
  const { data, isLoading } = testsApi.useGetAssignedTestsQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="px-8 py-10 flex flex-col h-full relative">
        <Heading title="Назначено тесты" />

        <div className="flex flex-col gap-1.5 mt-4">
          {data?.map((test) => <AssignedTestItem key={test.id} test={test} />)}
        </div>
      </div>
    </LoadingOverlay>
  );
}
