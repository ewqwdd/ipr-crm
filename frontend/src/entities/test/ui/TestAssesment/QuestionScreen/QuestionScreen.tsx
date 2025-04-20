import { useAppDispatch, useAppSelector } from '@/app';
import { Test } from '@/entities/test/types/types';
import TestConfirm from './TestConfirm';
import { QuestionScreenWrapper } from '@/shared/ui/QuestionScreenWrapper';
import { answerQuestion } from '../answerQuestion';
import {
  MultipleQuestion,
  NumberQuestion,
  SingleQuestion,
  TextQuestion,
} from '@/widgets/AssesmentQuestionPartials';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';

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
  const answers = useAppSelector((state) => state.testAssesment.answers);

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

  const onChangeMultiple = (index: number) => (options: number[]) => {
    const newAnswer = {
      optionAnswer: options,
    };

    dispatch(testAssesmentActions.setAnswer({ index, value: newAnswer }));
    answerQuestion(testId, question.id, newAnswer);
  };

  const onChangeSingle = (index: number) => (optionId: number) => {
    const answer = {
      optionAnswer: [optionId],
    };
    dispatch(testAssesmentActions.setAnswer({ index, value: answer }));
    answerQuestion(testId, question.id, answer);
  };

  const onChangeNumber = (index: number) => (value: string) => {
    dispatch(
      testAssesmentActions.setAnswer({
        index,
        value: {
          numberAnswer: value,
        },
      }),
    );
    answerQuestion(testId, question.id, {
      numberAnswer: Number(value),
    });
  };

  const onChangeText = (index: number) => (value: string) => {
    const answer = {
      textAnswer: value,
    };

    dispatch(testAssesmentActions.setAnswer({ index, value: answer }));
    answerQuestion(testId, question.id, answer);
  };

  const defaultProps = {
    answer: answers[screen],
    question: question,
  };

  return (
    <QuestionScreenWrapper
      handleBack={handleBack}
      handleForward={handleForward}
      questionNumber={screen + 1}
      required={test.testQuestions[screen]?.required}
    >
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-medium text-gray-900">{question?.label}</h3>
        {question?.type === 'TEXT' && (
          <TextQuestion {...defaultProps} onChange={onChangeText(screen)} />
        )}
        {question?.type === 'NUMBER' && (
          <NumberQuestion {...defaultProps} onChange={onChangeNumber(screen)} />
        )}
        {question?.type === 'SINGLE' && (
          <SingleQuestion {...defaultProps} onChange={onChangeSingle(screen)} />
        )}
        {question?.type === 'MULTIPLE' && (
          <MultipleQuestion
            {...defaultProps}
            onChange={onChangeMultiple(screen)}
          />
        )}
      </div>
      <TestConfirm onFinish={onFinish} test={test} />
    </QuestionScreenWrapper>
  );
}
