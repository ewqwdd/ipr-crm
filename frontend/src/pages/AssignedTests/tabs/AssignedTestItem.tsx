import { AssignedTest } from '@/entities/test';
import { dateService } from '@/shared/lib/dateService';
import { Card } from '@/shared/ui/Card';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';

interface AssignedTestItemProps {
  test: AssignedTest;
}

export default function AssignedTestItem({ test }: AssignedTestItemProps) {
  const startText = (
    <>
      Пройти тест <ArrowRightIcon className="ml-3 size-4 max-sm:hidden" />
    </>
  );
  const continueText = (
    <>
      Продолжить <ArrowRightIcon className="ml-3 size-4 max-sm:hidden" />
    </>
  );
  const isContinue = !!test.startDate;

  return (
    <Card className="[&>div]:flex [&>div]:gap-2 sm:[&>div]:gap-4 [&>div]:p-4 [&>div]:px-3 sm:[&>div]:p-3 sm:[&>div]:px-6  [&>div]:items-center">
      <h3 className="font-semibold text-gray-900 max-sm:text-sm truncate">
        {test.test?.name}
      </h3>
      <div className="flex gap-2 items-center max-sm:flex-col">
        {isContinue && (
          <p className="text-gray-500 ml-auto text-sm truncate max-w-32">
            <span className="max-sm:hidden">Начато:</span>
            <span className="sm:hidden">н:</span>{' '}
            {dateService.formatDateTime(test.startDate)}
          </p>
        )}
        {test.test.endDate && (
          <p className="text-gray-500 truncate max-sm:max-w-32">
            До: {dateService.formatDateTime(test.test.endDate)}
          </p>
        )}
      </div>
      <Link to={`/tests/${test.id}`} className={'max-sm:hidden ml-auto'}>
        <PrimaryButton>{!isContinue ? startText : continueText}</PrimaryButton>
      </Link>
      <Link
        to={`/tests/${test.id}`}
        className="sm:hidden text-sm text-violet-700 font-medium ml-auto"
      >
        {!isContinue ? startText : continueText}
      </Link>
    </Card>
  );
}
