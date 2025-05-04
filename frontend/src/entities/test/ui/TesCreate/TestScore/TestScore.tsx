import { memo, useEffect, useMemo } from 'react';
import StatsItem from './StatsItem';
import TimeLimit from './TimeLimit';
import MinScore from './MinScore';
import { CreateQuestion } from '@/entities/test/types/types';

interface TestScoreProps {
  questions: CreateQuestion[];
  limitByTime: boolean;
  timeLimit?: number;
  onToggleLimitByTime: (value: boolean) => void;
  onTimeLimitChange: (value: string) => void;
  minimumScore?: number;
  onChangeMinimumScore: (value?: string) => void;
}

export default memo(function TestScore({
  questions,
  limitByTime,
  onChangeMinimumScore,
  onTimeLimitChange,
  onToggleLimitByTime,
  minimumScore,
  timeLimit,
}: TestScoreProps) {
  const count = useMemo(() => {
    return questions.reduce(
      (acc, question) => {
        if (question.type === 'TEXT' && question.textCorrectValue) {
          return {
            score: acc.score + (question.score ?? 1),
            questions: acc.questions + 1,
          };
        } else if (
          question.type === 'NUMBER' &&
          (question.numberCorrectValue || question.numberCorrectValue === 0)
        ) {
          return {
            score: acc.score + (question.score ?? 1),
            questions: acc.questions + 1,
          };
        } else if (
          question.type === 'SINGLE' &&
          question.options?.some((option) => option.isCorrect)
        ) {
          const maxScore = Math.max(
            ...question.options
              .filter((q) => q.isCorrect)
              .map((q) => q.score ?? 1),
          );
          return { score: acc.score + maxScore, questions: acc.questions + 1 };
        } else if (
          question.type === 'MULTIPLE' &&
          question.options?.some((option) => option.isCorrect)
        ) {
          const score = question.options
            .filter((q) => q.isCorrect)
            .reduce((sum, o) => sum + (o.score ?? 1), 0);
          console.log(score);

          return { score: acc.score + score, questions: acc.questions + 1 };
        }
        return acc;
      },
      { score: 0, questions: 0 },
    );
  }, [questions]);

  useEffect(() => {
    if (minimumScore && minimumScore > count.score) {
      onChangeMinimumScore(count.score.toString());
    }
  }, [count, minimumScore, onChangeMinimumScore]);

  console.log(count, questions);

  return (
    <div className="flex flex-col gap-4 mt-6 max-w-xl">
      <StatsItem label="Всего вопросов:" value={questions.length} />
      <StatsItem label="Всего вопросов с ответами:" value={count.questions} />
      <TimeLimit
        limitByTime={limitByTime}
        onTimeLimitChange={onTimeLimitChange}
        onToggleLimitByTime={onToggleLimitByTime}
        timeLimit={timeLimit}
      />
      <MinScore
        maxScore={count.score}
        onChangeMinimumScore={onChangeMinimumScore}
        minimumScore={minimumScore}
      />
    </div>
  );
});
