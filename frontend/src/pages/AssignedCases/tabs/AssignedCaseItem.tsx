import { CaseRate } from '@/entities/cases';
import { dateService } from '@/shared/lib/dateService';
import { Card } from '@/shared/ui/Card';
import { SoftButton } from '@/shared/ui/SoftButton';
import { Link } from 'react-router';

interface AssignedTestItemProps {
  caseItem: CaseRate;
}

export default function AssignedCaseItem({ caseItem }: AssignedTestItemProps) {
  return (
    <Card className="[&>div]:flex [&>div]:gap-2 sm:[&>div]:gap-4 [&>div]:p-4 [&>div]:px-3 sm:[&>div]:p-3 sm:[&>div]:px-6  [&>div]:items-center">
      <Link
        to={`/users/${caseItem.user.id}`}
        className="font-semibold text-indigo-600 hover:text-indigo-800 max-sm:text-sm truncate"
      >
        {caseItem?.user.username}
      </Link>
      <div className="flex gap-2 items-center max-sm:flex-col">
        <p className="text-gray-500 ml-auto text-sm truncate max-w-32">
          {caseItem.startDate && dateService.formatDate(caseItem.startDate)}
        </p>
      </div>
      <Link to={`/assigned-cases/${caseItem.id}`} className=" ml-auto">
        <SoftButton>Начать</SoftButton>
      </Link>
    </Card>
  );
}
