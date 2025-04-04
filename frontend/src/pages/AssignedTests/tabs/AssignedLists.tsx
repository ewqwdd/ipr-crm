import { testsApi } from '@/shared/api/testsApi';
import AssignedTestItem from './AssignedTestItem';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useEffect } from 'react';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';
import { useAppDispatch } from '@/app';

export default function AssignedLists() {
  const { data, isLoading } = testsApi.useGetAssignedTestsQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [isLoading, dispatch]);

  return (
    <div className="flex flex-col gap-1.5 mt-4 h-full">
      {data?.map((test) => <AssignedTestItem key={test.id} test={test} />)}
      {data?.length === 0 && <EmptyState />}
    </div>
  );
}
