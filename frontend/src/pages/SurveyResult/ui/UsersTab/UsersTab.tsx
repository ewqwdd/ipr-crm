import { Survey } from '@/entities/survey';
import { displayName } from '@/shared/lib/displayName';
import { Card } from '@/shared/ui/Card';
import { SearchSelect } from '@/shared/ui/SearchSelect';
import { useMemo, useState } from 'react';
import SurveyResultQuestion from '../SurveyResultQuestion/SurveyResultQuestion';
import { dateService } from '@/shared/lib/dateService';

interface UsersTabProps {
  survey?: Survey;
}

type SelectValue = { id: number; name: string };

export default function UsersTab({ survey }: UsersTabProps) {
  const [userId, setUserId] = useState<number | undefined>();

  const options = useMemo<SelectValue[]>(() => {
    return (
      survey?.usersAssigned?.map((user) => ({
        id: user.user.id,
        name: user.user.username ?? displayName(user.user),
      })) ?? []
    );
  }, [survey]);

  const handleUserChange = (value: SelectValue) => {
    setUserId(value.id);
  };

  const userAssigned = survey?.usersAssigned.find(
    (user) => user.userId === userId,
  );

  console.log(userAssigned);

  const userOnlyAnswers = survey?.surveyQuestions.map((question) => {
    const answeredQuestions = question.answeredQuestions.filter(
      (answer) => answer.userId === userId,
    );
    return {
      ...question,
      answeredQuestions: answeredQuestions,
    };
  });

  return (
    <div className="flex flex-col pt-10 pb-20">
      <Card className="bg-gray-50 [&>div]:flex overflow-visible max-w-md">
        <SearchSelect
          label="Выберите пользователя"
          value={userId}
          options={options}
          onChange={handleUserChange}
          className={'max-w-52'}
        />
        <div className="flex flex-col items-end flex-1 justify-between">
          <h3 className="font-medium text-sm">Дата прохождения</h3>
          <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
            {userAssigned?.endDate
              ? dateService.formatDate(userAssigned?.endDate)
              : 'Не завершено'}
          </p>
        </div>
      </Card>

      <div className="border-b border-gray-200 w-full my-8" />

      <h2 className="text-xl font-semibold mb-4">Ответы</h2>
      <div className="flex flex-col sm:-mx-8">
        {userId &&
          userOnlyAnswers?.map((question, index) => (
            <SurveyResultQuestion question={question} index={index} />
          ))}
      </div>
    </div>
  );
}
