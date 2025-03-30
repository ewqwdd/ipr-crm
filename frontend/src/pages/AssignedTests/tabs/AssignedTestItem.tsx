import { AssignedTest } from '@/entities/test';
import { Card } from '@/shared/ui/Card';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';

interface AssignedTestItemProps {
  test: AssignedTest;
}

export default function AssignedTestItem({ test }: AssignedTestItemProps) {
  return (
    <Card className="[&>div]:flex [&>div]:gap-4 [&>div]:p-3 [&>div]:px-6  [&>div]:items-center">
      <h3 className="font-semibold text-gray-900">{test.test?.name}</h3>
      <span className="text-gray-500">{test.startDate?.slice(0, 10)}</span>
      <Link to={`/tests/${test.id}`} className="ml-auto">
        <PrimaryButton>
          Пройти тест <ArrowRightIcon className="ml-3 size-4" />
        </PrimaryButton>
      </Link>
    </Card>
  );
}
