import { AssignedSurvey } from '@/entities/survey';
import { cva } from '@/shared/lib/cva';
import { dateService } from '@/shared/lib/dateService';
import { Card } from '@/shared/ui/Card';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';

interface AssignedSurveyItemProps {
  survey: AssignedSurvey;
}

export default function AssignedSurveyItem({
  survey,
}: AssignedSurveyItemProps) {
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
  const isContinue = !!survey.startDate;

  return (
    <Card className="[&>div]:flex [&>div]:gap-4 [&>div]:p-3 [&>div]:px-6  [&>div]:items-center">
      <h3 className="font-semibold text-gray-900 max-sm:text-sm max-sm:truncate">
        {survey.survey?.name}
      </h3>
      <div className="flex gap-2 items-center max-sm:flex-col">
        {isContinue && (
          <p className="text-gray-500 ml-auto text-sm truncate max-w-32">
            <span className="max-sm:hidden">Начато:</span>
            <span className="sm:hidden">н:</span>{' '}
            {dateService.formatDateTime(survey.startDate)}
          </p>
        )}
        {survey.survey.endDate && (
          <p className="text-gray-500 truncate max-sm:max-w-32">
            До: {dateService.formatDateTime(survey.survey.endDate)}
          </p>
        )}
      </div>
      <Link
        to={`/surveys/${survey.id}`}
        className={cva('max-sm:hidden', { 'ml-auto': !isContinue })}
      >
        <PrimaryButton>{!isContinue ? startText : continueText}</PrimaryButton>
      </Link>
      <Link
        to={`/tests/${survey.id}`}
        className="sm:hidden text-sm text-violet-700 font-medium"
      >
        {!isContinue ? startText : continueText}
      </Link>
    </Card>
  );
}
