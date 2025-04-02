import { Test } from '@/entities/test';
import {
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline';

interface TestScoreProps {
  test: {
    test: Test;
    score?: number | null;
    questionsCount?: number;
  };
  finished?: boolean;
}

export default function TestScore({ test, finished = true }: TestScoreProps) {
  return (
    <>
      {test.test.minimumScore && finished ? (
        (test.score ?? 0) >= test.test.minimumScore ? (
          <CheckCircleIcon className="text-green-500 size-4" />
        ) : (
          <XCircleIcon className="text-red-500 size-4" />
        )
      ) : (
        <MinusCircleIcon className="text-gray-500 size-4" />
      )}
      <span className="text-gray-500 text-sm">
        {test.score ?? 0}{' '}
        {Boolean(test.questionsCount) && `из ${test.questionsCount}`}
      </span>
    </>
  );
}
