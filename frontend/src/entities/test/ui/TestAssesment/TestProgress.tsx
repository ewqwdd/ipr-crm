import { useAppSelector } from '@/app';
import { AssignedTest } from '../../types/types';
import { memo } from 'react';

interface TestProgressProps {
  test: AssignedTest;
}

export default memo(function TestProgress({ test }: TestProgressProps) {
  const answers = useAppSelector((state) => state.testAssesment.answers);
  const questions = test.test.testQuestions;
  const countAnswers = Object.entries(answers).filter(([i, answer]) => {
    const question = questions[Number(i)];
    console.debug(answers);
    if (['SINGLE', 'MULTIPLE'].includes(question?.type ?? '')) {
      return (answer.optionAnswer?.length ?? 0) > 0;
    } else if (question?.type === 'NUMBER') {
      return (answer.numberAnswer?.length ?? 0) > 0;
    } else if (question?.type === 'TEXT') {
      return (answer.textAnswer?.length ?? 0) > 0;
    }
  }).length;
  const total = questions.length;

  return (
    <div className="mt-5 self-center text-gray-900 font-semibold">
      {countAnswers}/{total}
    </div>
  );
});
