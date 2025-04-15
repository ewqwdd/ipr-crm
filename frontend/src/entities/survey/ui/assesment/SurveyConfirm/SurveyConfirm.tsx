import { useAppSelector } from '@/app';
import { StoreAnswer, Survey } from '@/entities/survey/types/types';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useMemo } from 'react';

interface TestConfirmProps {
  survey: Survey;
  onFinish?: () => void;
}

const answerKeyByType: Record<string, (answer: StoreAnswer) => boolean> = {
  MULTIPLE: (a) => !!a?.optionAnswer?.length,
  SINGLE: (a) => !!a?.optionAnswer?.length,
  NUMBER: (a) => a?.numberAnswer !== undefined && a?.numberAnswer !== null,
  TEXT: (a) => !!a?.textAnswer,
  DATE: (a) => !!a?.dateAnswer,
  FILE: (a) => !!a?.fileAnswer,
  PHONE: (a) => !!a?.phoneAnswer,
  TIME: (a) => !!a?.timeAnswer,
  SCALE: (a) => !!a?.scaleAnswer,
};

export default function SurveyConfirm({ survey, onFinish }: TestConfirmProps) {
  const answers = useAppSelector((state) => state.surveyAssesment.answers);

  const allQuestionsAnswered = useMemo(() => {
    return survey.surveyQuestions.every((question, index) => {
      if (!question.required) return true;

      const answer = answers[index];
      const validate = answerKeyByType[question.type];
      return validate ? validate(answer) : false;
    });
  }, [answers, survey]);

  return (
    <PrimaryButton
      onClick={onFinish}
      className="self-end mt-auto"
      disabled={!allQuestionsAnswered}
    >
      Завершить
    </PrimaryButton>
  );
}
