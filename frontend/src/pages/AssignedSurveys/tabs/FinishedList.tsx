import { EmptyState } from '@/shared/ui/EmptyState';
import { useEffect } from 'react';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';
import { useAppDispatch } from '@/app';
import FinishedListItem from './FinishedListItem';
import { surveyApi } from '@/shared/api/surveyApi';

export default function FinishedList() {
  const { data, isLoading } = surveyApi.useGetFinishedTestsForUserQuery();
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
      {data?.map((survey) => (
        <FinishedListItem survey={survey} key={survey.id} />
      ))}
      {data?.length === 0 && <EmptyState />}
    </div>
  );
}
