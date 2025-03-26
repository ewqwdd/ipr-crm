import { useAppSelector } from '@/app';
import { useMemo } from 'react';
import StatsItem from './StatsItem';
import TimeLimit from './TimeLimit';
import MinScore from './MinScore';

export default function TestScore() {
  const questions = useAppSelector((state) => state.testCreate.questions);

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
      <TimeLimit />
      <MinScore />
    </div>
  );
}
