import { Test } from '@/entities/test';
import { Card } from '@/shared/ui/Card';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';

interface AssignedTestItemProps {
  test: Test;
}

export default function AssignedTestItem({ test }: AssignedTestItemProps) {
  return (
    <Card className="[&>div]:flex [&>div]:gap-4 [&>div]:p-2">
      <h3 className="font-semibold text-gray-900">{test.name}</h3>
      <span className="text-gray-500">
        {test.startDate?.toDateString().slice(0, 10)}
      </span>
      <Link to={`/tests/${test.id}`}>
        <PrimaryButton>
          Пройти тест <ArrowLeftIcon className="size-4" />
        </PrimaryButton>
      </Link>
    </Card>
  );
}
