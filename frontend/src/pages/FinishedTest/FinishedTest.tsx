import { useAppDispatch } from '@/app';
import { hideLoading, showLoading } from '@/app/store/loadingSlice';
import { testsApi } from '@/shared/api/testsApi';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Heading } from '@/shared/ui/Heading';
import { TestResultScore } from '@/shared/ui/TestResultScore';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function FinishedTest() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isSuccess, isError } =
    testsApi.useGetFinishedTestForUserQuery(parseInt(id ?? '-1'));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [isLoading, dispatch]);

  return (
    <div className={'px-8 py-10 flex flex-col h-full relative'}>
      <div className="flex justify-between items-center">
        <Heading title="Прохождение теста" />
      </div>
      {isSuccess && (
        <Card className="[&>div]:min-w-80 [&>div]:min-h-48 [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:justify-center [&>div]:gap-2 mt-4">
          <h2 className="text-lg font-semibold text-center">
            {data?.test.name}
          </h2>
          <p className="text-sm text-center text-gray-800 font-medium">
            Тест пройден
          </p>
          <p className="text-sm text-center text-gray-600">
            {data?.test.passedMessage ? data?.test.passedMessage : ''}
          </p>
          {data?.test.showScoreToUser && (
            <div className="flex gap-2 items-center">
              <TestResultScore test={data} />
            </div>
          )}
        </Card>
      )}
      {isError && <EmptyState />}
    </div>
  );
}
