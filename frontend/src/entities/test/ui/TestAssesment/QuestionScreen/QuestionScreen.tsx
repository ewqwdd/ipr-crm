import { useAppDispatch } from '@/app';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { Test } from '@/entities/test/types/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import TextQuestion from './TextQuestion';
import NumberQuestion from './NumberQuestion';
import SingleQuestion from './SingleQuestion';
import MultipleQuestion from './MultipleQuestion';
import TestConfirm from './TestConfirm';

interface QuestionScreenProps {
  test: Test;
  screen: number;
  onFinish?: () => void;
  testId: number;
}

export default function QuestionScreen({
  test,
  screen,
  onFinish,
  testId,
}: QuestionScreenProps) {
  const dispatch = useAppDispatch();

  const handleForward = () => {
    if (screen < test.testQuestions.length - 1) {
      dispatch(testAssesmentActions.setScreen(screen + 1));
    } else {
      dispatch(testAssesmentActions.setScreen(0));
    }
  };

  const handleBack = () => {
    if (screen > 0) {
      dispatch(testAssesmentActions.setScreen(screen - 1));
    } else {
      dispatch(testAssesmentActions.setScreen(test.testQuestions.length - 1));
    }
  };

  const question = test.testQuestions[screen];

  const defaultProps = {
    testId,
    index: screen,
    question: question,
  };

  return (
    <div className="flex flex-col gap-4 h-full flex-1">
      <div className="flex">
        <button onClick={handleBack}>
          <ArrowLeftIcon className="size-4" />
        </button>
        <h3 className="text text-center flex-1 font-medium text-gray-700">
          Вопрос {screen + 1}
          {test.testQuestions[screen]?.required && (
            <span className="text-red-500 text-sm relative -top-0.5 left-px">
              *
            </span>
          )}
        </h3>
        <button onClick={handleForward}>
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-medium text-gray-900">{question?.label}</h3>
        {question?.type === 'TEXT' && <TextQuestion {...defaultProps} />}
        {question?.type === 'NUMBER' && <NumberQuestion {...defaultProps} />}
        {question?.type === 'SINGLE' && <SingleQuestion {...defaultProps} />}
        {question?.type === 'MULTIPLE' && (
          <MultipleQuestion {...defaultProps} />
        )}
      </div>
      <TestConfirm onFinish={onFinish} test={test} />
    </div>
  );
}
