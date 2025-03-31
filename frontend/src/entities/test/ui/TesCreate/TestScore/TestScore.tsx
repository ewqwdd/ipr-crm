import { memo, useMemo } from 'react';
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
    return questions.reduce((acc, question) => {
      if (question.type === 'TEXT' && question.textCorrectValue) {
        return acc + 1;
      } else if (question.type === 'NUMBER' && question.numberCorrectValue) {
        return acc + 1;
      } else if (
        (question.type === 'SINGLE' || question.type === 'MULTIPLE') &&
        question.options?.some((option) => option.isCorrect)
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [questions]);

  return (
    <div className="flex flex-col gap-4 mt-6 max-w-xl">
      <StatsItem label="Всего вопросов:" value={questions.length} />
      <StatsItem label="Всего вопросов с ответами:" value={count} />
      <TimeLimit
        limitByTime={limitByTime}
        onTimeLimitChange={onTimeLimitChange}
        onToggleLimitByTime={onToggleLimitByTime}
        timeLimit={timeLimit}
      />
      <MinScore
        maxScore={count}
        onChangeMinimumScore={onChangeMinimumScore}
        minimumScore={minimumScore}
      />
    </div>
  );
});
