import { testsApi } from '@/shared/api/testsApi';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { TestResultScore } from '@/shared/ui/TestResultScore';
import { useParams } from 'react-router';

export default function FinishedTest() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isSuccess, isError } =
    testsApi.useGetFinishedTestForUserQuery(parseInt(id ?? '-1'));

  return (
    <LoadingOverlay active={isLoading}>
      <div
        className={'px-4 py-6 sm:px-8 sm:py-10 flex flex-col h-full relative'}
      >
        <div className="flex justify-between items-center">
          <Heading title="Прохождение теста" />
        </div>
        {isSuccess && (
          <Card className="[&>div]:min-w-80 [&>div]:min-h-48 [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:justify-center [&>div]:gap-2 mt-4">
            <h2 className="text-lg font-semibold text-center">
              {data?.test.name}
            </h2>
            <p className="text-sm text-center text-gray-600">Тест пройден</p>
            {data?.test.showScoreToUser && (
              <div className="flex gap-2 items-center">
                <TestResultScore test={data} />
              </div>
            )}
          </Card>
        )}
        {isError && <EmptyState />}
      </div>
    </LoadingOverlay>
  );
}
