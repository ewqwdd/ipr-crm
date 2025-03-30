import { testsApi } from '@/shared/api/testsApi';
import AssignedTestItem from './AssignedTestItem';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useEffect } from 'react';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';

export default function AssignedLists() {
  const { data, isLoading } = testsApi.useGetAssignedTestsQuery();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  return (
    <div className="flex flex-col gap-1.5 mt-4 h-full">
      {data?.map((test) => <AssignedTestItem key={test.id} test={test} />)}
      {data?.length === 0 && <EmptyState />}
    </div>
  );
}
