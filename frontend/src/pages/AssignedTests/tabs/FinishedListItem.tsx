import { AssignedTest } from '@/entities/test';
import { Card } from '@/shared/ui/Card';
import { TestResultScore } from '@/shared/ui/TestResultScore';

interface FinishedListItemProps {
  test: AssignedTest;
}

export default function FinishedListItem({ test }: FinishedListItemProps) {
  return (
    <Card className="[&>div]:flex [&>div]:gap-4 [&>div]:p-3 [&>div]:px-6  [&>div]:items-center max-sm:min-h-12 [&>div]:max-w-full [&>div]:overflow-clip">
      <h3 className="font-semibold text-gray-900 max-sm:text-sm truncate w-full">
        {test.test?.name}
      </h3>
      <span className="text-gray-500 text-xs sm:text-sm text-nowrap">
        {test.endDate?.slice(0, 10)}
      </span>

      {test.test.showScoreToUser && (
        <div className="flex items-center gap-2 ml-auto text-nowrap">
          <TestResultScore test={test} />
        </div>
      )}
    </Card>
  );
}
