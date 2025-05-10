import { Survey } from '@/entities/survey';
import { Card } from '@/shared/ui/Card';
import { UserIcon } from '@heroicons/react/outline';
import SurveyResultQuestion from '../SurveyResultQuestion/SurveyResultQuestion';

interface GeneralTabProps {
  survey?: Survey;
}

export default function GeneralTab({ survey }: GeneralTabProps) {
  const usersAssigned = survey?.usersAssigned?.length ?? 0;
  const finishedUsers =
    survey?.usersAssigned?.filter((user) => user.finished).length ?? 0;

  return (
    <div className="flex flex-col pt-10 pb-20">
      <Card className="bg-gray-50 self-start">
        <h3 className="font-medium mb-6">Сотрудников прошли опрос </h3>
        <p className="text-gray-500 text-sm flex items-center gap-2">
          <UserIcon className="inline text-violet-600 size-4" /> {finishedUsers}{' '}
          из {usersAssigned}
        </p>
      </Card>
      <div className="border-b border-gray-200 w-full my-8"></div>
      <h2 className="text-xl font-semibold mb-4">Ответы</h2>
      <div className="flex flex-col sm:-mx-8">
        {survey?.surveyQuestions.map((question, index) => (
          <SurveyResultQuestion question={question} index={index} />
        ))}
      </div>
    </div>
  );
}
