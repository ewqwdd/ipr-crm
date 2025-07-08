import { useAppSelector } from '@/app';
import { AssignedTest } from '../../types/types';
import { memo } from 'react';

interface TestProgressProps {
  test: AssignedTest;
}

export default memo(function TestProgress({ test }: TestProgressProps) {
  const answers = useAppSelector((state) => state.testAssesment.answers);
  const answersCount = Object.values(answers).filter(
    (answer) =>
      !answer.numberAnswer && !answer.textAnswer && !answer.optionAnswer,
  ).length;
  const progress =
    answersCount === 0
      ? 0
      : (test.test.testQuestions.length / answersCount) * 100;

  return (
    <div className="mt-5 self-center text-gray-900 font-semibold">
      {progress.toFixed(0)}%
    </div>
  );
});
