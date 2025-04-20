import { AssignedSurvey } from '@/entities/survey';
import { Card } from '@/shared/ui/Card';

interface FinishedListItemProps {
  survey: AssignedSurvey;
}

export default function FinishedListItem({ survey }: FinishedListItemProps) {
  return (
    <Card className="[&>div]:flex [&>div]:gap-4 [&>div]:p-3 [&>div]:px-6  [&>div]:items-center max-sm:min-h-12 [&>div]:max-w-full [&>div]:overflow-clip">
      <h3 className="font-semibold text-gray-900 max-sm:text-sm truncate w-full">
        {survey.survey?.name}
      </h3>
      <span className="text-gray-500 text-xs sm:text-sm text-nowrap">
        {survey.endDate?.slice(0, 10)}
      </span>

      <div className="flex items-center gap-2 ml-auto text-nowrap">
        <span className="text-violet-700 text-sm font-medium">Пройдено</span>
      </div>
    </Card>
  );
}
