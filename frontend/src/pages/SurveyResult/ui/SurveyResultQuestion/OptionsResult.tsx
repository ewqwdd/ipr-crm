import { Survey } from '@/entities/survey';
import { Progress } from '@/shared/ui/Progress';
import { memo } from 'react';

interface OptionsResultProps {
  question: Survey['surveyQuestions'][number];
  totalAnswers: number;
  individual?: boolean;
}

export default memo(function OptionsResult({
  question,
  totalAnswers,
  individual,
}: OptionsResultProps) {
  return (
    <ul className="flex flex-col gap-3 max-w-md">
      {question.options?.map((option, index) => {
        const answers =
          question.answeredQuestions.filter((answer) =>
            answer.options?.find((o) => o.optionId === option.id),
          )?.length ?? 0;
        const percentage = totalAnswers > 0 ? answers / totalAnswers : 0;

        return (
          <li
            key={index}
            className="flex flex-col gap-1 text-sm font-medium text-gray-700"
          >
            <div className="flex gap-4">
              <p className="flex-1 truncate">{option.value}</p>
              {individual ? (
                <span className="text-indigo-600 size-5 rounded-full" />
              ) : (
                <p>
                  {answers}{' '}
                  <span className="text-gray-500 font-normal min-w-10 inline-block text-right">
                    {Math.round(percentage * 100)}%
                  </span>
                </p>
              )}
            </div>
            {!individual && (
              <Progress
                percent={percentage}
                className="h-2 [&>figure]:bg-indigo-500 bg-gray-200 rounded-full"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
});
