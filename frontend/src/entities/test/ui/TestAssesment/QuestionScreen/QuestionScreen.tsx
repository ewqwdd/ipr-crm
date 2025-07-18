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
  const errors = useAppSelector((state) => state.testAssesment.errors);

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
    answerQuestion(testId, question.id, newAnswer, dispatch);
  };

  const onChangeSingle = (index: number) => (optionId: number) => {
    const answer = {
      optionAnswer: [optionId],
    };
    dispatch(testAssesmentActions.setAnswer({ index, value: answer }));
    answerQuestion(testId, question.id, answer, dispatch);
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
    answerQuestion(
      testId,
      question.id,
      {
        numberAnswer: Number(value),
      },
      dispatch,
    );
  };

  const onChangeText = (index: number) => (value: string) => {
    const answer = {
      textAnswer: value,
    };

    dispatch(testAssesmentActions.setAnswer({ index, value: answer }));
    answerQuestion(testId, question.id, answer, dispatch);
  };

  const setError = (index: number) => (error?: string) => {
    dispatch(testAssesmentActions.setError({ index, error }));
  };

  const defaultProps = {
    answer: answers[screen],
    question: question,
    setError: setError(screen),
    error: errors[screen],
  };

  return (
    <QuestionScreenWrapper
      handleBack={handleBack}
      handleForward={handleForward}
      questionNumber={screen + 1}
      required={test.testQuestions[screen]?.required}
    >
      <div className="flex flex-col gap-4 mt-2">
        {question.photoUrl && (
          <img
            src={
              import.meta.env.VITE_FILES_URL + '/uploads/' + question.photoUrl
            }
            alt="Question"
            className="h-40 self-center rounded shadow"
          />
        )}
        <h3 className="text-lg font-medium text-gray-900">{question?.label}</h3>
        {question?.type === 'TEXT' && (
          <TextQuestion
            key={screen}
            {...defaultProps}
            onChange={onChangeText(screen)}
          />
        )}
        {question?.type === 'NUMBER' && (
          <NumberQuestion
            key={screen}
            {...defaultProps}
            onChange={onChangeNumber(screen)}
          />
        )}
        {question?.type === 'SINGLE' && (
          <SingleQuestion
            key={screen}
            {...defaultProps}
            onChange={onChangeSingle(screen)}
          />
        )}
        {question?.type === 'MULTIPLE' && (
          <MultipleQuestion
            key={screen}
            {...defaultProps}
            onChange={onChangeMultiple(screen)}
          />
        )}
      </div>
      <TestConfirm onFinish={onFinish} test={test} />
    </QuestionScreenWrapper>
  );
}
