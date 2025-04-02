import { AssignedTest } from '@/entities/test';
import { cva } from '@/shared/lib/cva';
import { formatDateTime } from '@/shared/lib/formatDateTime';
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
      Пройти тест <ArrowRightIcon className="ml-3 size-4" />
    </>
  );
  const continueText = (
    <>
      Продолжить <ArrowRightIcon className="ml-3 size-4" />
    </>
  );
  const isContinue = !!test.startDate;

  return (
    <Card className="[&>div]:flex [&>div]:gap-4 [&>div]:p-3 [&>div]:px-6  [&>div]:items-center">
      <h3 className="font-semibold text-gray-900">{test.test?.name}</h3>
      {test.test.endDate && (
        <span className="text-gray-500">
          До: {formatDateTime(test.test.endDate)}
        </span>
      )}
      {isContinue && (
        <span className="text-gray-500 ml-auto text-sm">
          Начато: {formatDateTime(test.startDate)}
        </span>
      )}
      <Link
        to={`/tests/${test.id}`}
        className={cva({ 'ml-auto': !isContinue })}
      >
        <PrimaryButton>{!isContinue ? startText : continueText}</PrimaryButton>
      </Link>
    </Card>
  );
}
