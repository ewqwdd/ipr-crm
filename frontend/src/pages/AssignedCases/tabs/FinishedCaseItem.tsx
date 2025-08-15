import { CaseRate } from '@/entities/cases';
import { dateService } from '@/shared/lib/dateService';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Link } from 'react-router';

interface FinishedCaseItemProps {
  caseItem: CaseRate;
}

export default function FinishedCaseItem({ caseItem }: FinishedCaseItemProps) {
  return (
    <Card className="[&>div]:flex [&>div]:min-h-[62px] [&>div]:gap-2 sm:[&>div]:gap-4 [&>div]:p-4 [&>div]:px-3 sm:[&>div]:p-3 sm:[&>div]:px-6  [&>div]:items-center">
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
        <Badge color="yellow">Оценен</Badge>
      </div>
      {caseItem.finished && (
        <span className="text-sm font-medium text-gray-600 ml-auto">
          Завершено
        </span>
      )}
    </Card>
  );
}
