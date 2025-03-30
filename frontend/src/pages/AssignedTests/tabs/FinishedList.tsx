import { testsApi } from '@/shared/api/testsApi';
import { Card } from '@/shared/ui/Card';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function FinishedList() {
  const { data, isLoading } = testsApi.useGetFinishedTestsQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="flex flex-col gap-1.5 mt-4">
        {data?.map((test) => (
          <Card className="[&>div]:flex [&>div]:gap-4 [&>div]:p-3 [&>div]:px-6  [&>div]:items-center">
            <h3 className="font-semibold text-gray-900">{test.test?.name}</h3>
            <span className="text-gray-500 text-sm">
              {test.endDate?.slice(0, 10)}
            </span>
          </Card>
        ))}
      </div>
    </LoadingOverlay>
  );
}
