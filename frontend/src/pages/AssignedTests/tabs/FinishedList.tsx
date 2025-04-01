import { testsApi } from '@/shared/api/testsApi';
import FinishedListItem from './FinishedListItem';
import { EmptyState } from '@/shared/ui/EmptyState';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function FinishedList() {
  const { data, isLoading } = testsApi.useGetFinishedTestsQuery();

  // TODO: replace loading

  return (
    <LoadingOverlay active={isLoading}>
      <div className="flex flex-col gap-1.5 mt-4 h-full">
        {data?.map((test) => <FinishedListItem test={test} key={test.id} />)}
        {data?.length === 0 && <EmptyState />}
      </div>
    </LoadingOverlay>
  );
}
