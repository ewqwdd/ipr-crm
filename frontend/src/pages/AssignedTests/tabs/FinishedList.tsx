import { testsApi } from '@/shared/api/testsApi';
import FinishedListItem from './FinishedListItem';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useEffect } from 'react';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';

export default function FinishedList() {
  const { data, isLoading } = testsApi.useGetFinishedTestsQuery();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  return (
    <div className="flex flex-col gap-1.5 mt-4 h-full">
      {data?.map((test) => <FinishedListItem test={test} key={test.id} />)}
      {data?.length === 0 && <EmptyState />}
    </div>
  );
}
