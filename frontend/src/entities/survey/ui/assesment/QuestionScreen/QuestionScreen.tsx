import { useAppDispatch, useAppSelector } from '@/app';
import { QuestionScreenWrapper } from '@/shared/ui/QuestionScreenWrapper';
import { Survey } from '@/entities/survey/types/types';
import { surveyAssesmentActions } from '@/entities/survey/surveyAssesmentSlice';
import {
  DateQuestion,
  FileQuestion,
  MultipleQuestion,
  NumberQuestion,
  PhoneQuestion,
  ScaleQuestion,
  SingleQuestion,
  TextQuestion,
  TimeQuestion,
} from '@/widgets/AssesmentQuestionPartials';
import { answerSurveyQuestion } from '@/entities/survey/llib/answerSurveyQuestion';
import { useState } from 'react';
import { cva } from '@/shared/lib/cva';
import SurveyConfirm from '../SurveyConfirm/SurveyConfirm';

interface QuestionScreenProps {
  survey: Survey;
  screen: number;
  onFinish?: () => void;
  surveyId: number;
}

export default function QuestionScreen({
  survey,
  screen,
  onFinish,
  surveyId,
}: QuestionScreenProps) {
  const dispatch = useAppDispatch();
  const answers = useAppSelector((state) => state.surveyAssesment.answers);
  const errors = useAppSelector((state) => state.surveyAssesment.errors);

  const [loading, setLoading] = useState(false);

  const handleForward = () => {
    if (screen < survey.surveyQuestions.length - 1) {
      dispatch(surveyAssesmentActions.setScreen(screen + 1));
    } else {
      dispatch(surveyAssesmentActions.setScreen(0));
    }
  };

  const handleBack = () => {
    if (screen > 0) {
      dispatch(surveyAssesmentActions.setScreen(screen - 1));
    } else {
      dispatch(
        surveyAssesmentActions.setScreen(survey.surveyQuestions.length - 1),
      );
    }
  };

  const question = survey.surveyQuestions[screen];

  const onChangeMultiple = (index: number) => (options: number[]) => {
    const newAnswer = {
      optionAnswer: options,
    };

    dispatch(surveyAssesmentActions.setAnswer({ index, value: newAnswer }));
    answerSurveyQuestion(surveyId, question.id, newAnswer);
  };

  const onChangeSingle = (index: number) => (optionId: number) => {
    const answer = {
      optionAnswer: [optionId],
    };
    dispatch(surveyAssesmentActions.setAnswer({ index, value: answer }));
    answerSurveyQuestion(surveyId, question.id, answer);
  };

  const onChangeNumber = (index: number) => (value: string) => {
    dispatch(
      surveyAssesmentActions.setAnswer({
        index,
        value: {
          numberAnswer: value,
        },
      }),
    );
    if (question.minNumber && Number(value) < question.minNumber) return;
    if (question.maxNumber && Number(value) > question.maxNumber) return;
    answerSurveyQuestion(surveyId, question.id, {
      numberAnswer: Number(value),
    });
  };

  const onChangeText = (index: number) => (value: string) => {
    const answer = {
      textAnswer: value,
    };

    dispatch(surveyAssesmentActions.setAnswer({ index, value: answer }));
    answerSurveyQuestion(surveyId, question.id, answer);
  };

  const onChangePhone = (index: number) => (value: string, error?: boolean) => {
    const answer = {
      phoneAnswer: value,
    };
    dispatch(surveyAssesmentActions.setAnswer({ index, value: answer }));
    if (!error) {
      answerSurveyQuestion(surveyId, question.id, answer);
    }
  };

  const onChangeFile = (index: number) => (file?: File) => {
    console.log('file', file);
    dispatch(
      surveyAssesmentActions.setAnswer({
        index,
        value: {
          fileAnswer: true,
        },
      }),
    );
    setLoading(true);
    answerSurveyQuestion(
      surveyId,
      question.id,
      {
        fileAnswer: file,
      },
      () => setLoading(false),
    );
  };

  const onChangeDate = (index: number) => (value: string) => {
    const answer = {
      dateAnswer: value,
    };
    dispatch(surveyAssesmentActions.setAnswer({ index, value: answer }));
    answerSurveyQuestion(surveyId, question.id, answer);
  };

  const onChangeTime = (index: number) => (value: string, error?: boolean) => {
    const answer = {
      timeAnswer: value,
    };
    dispatch(surveyAssesmentActions.setAnswer({ index, value: answer }));
    if (!error) {
      answerSurveyQuestion(surveyId, question.id, answer);
    }
  };

  const onChangeScale = (index: number) => (value: number) => {
    const answer = {
      scaleAnswer: value,
    };
    dispatch(surveyAssesmentActions.setAnswer({ index, value: answer }));
    answerSurveyQuestion(surveyId, question.id, answer);
  };

  const setError = (index: number) => (error?: string) => {
    dispatch(surveyAssesmentActions.setError({ index, error }));
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
      required={survey.surveyQuestions[screen]?.required}
    >
      <div
        className={cva('flex flex-col gap-4 mt-2', {
          'pointer-events-none animate-pulse': loading,
        })}
      >
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
        {question?.type === 'FILE' && (
          <FileQuestion
            {...defaultProps}
            onChange={onChangeFile(screen)}
            loading={loading}
          />
        )}
        {question?.type === 'PHONE' && (
          <PhoneQuestion {...defaultProps} onChange={onChangePhone(screen)} />
        )}
        {question?.type === 'DATE' && (
          <DateQuestion {...defaultProps} onChange={onChangeDate(screen)} />
        )}
        {question?.type === 'TIME' && (
          <TimeQuestion {...defaultProps} onChange={onChangeTime(screen)} />
        )}
        {question?.type === 'SCALE' && (
          <ScaleQuestion {...defaultProps} onChange={onChangeScale(screen)} />
        )}
      </div>
      <SurveyConfirm survey={survey} onFinish={onFinish} />
    </QuestionScreenWrapper>
  );
}
