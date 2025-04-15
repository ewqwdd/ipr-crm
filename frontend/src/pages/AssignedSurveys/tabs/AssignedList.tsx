import { EmptyState } from '@/shared/ui/EmptyState';
import { useEffect } from 'react';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';
import { useAppDispatch } from '@/app';
import { surveyApi } from '@/shared/api/surveyApi';
import AssignedSurveyItem from './AssignedSurveyItem';

export default function AssignedList() {
  const { data, isLoading } = surveyApi.useGetAssignedSurveysQuery();
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
        <AssignedSurveyItem key={survey.id} survey={survey} />
      ))}
      {data?.length === 0 && <EmptyState />}
    </div>
  );
}
