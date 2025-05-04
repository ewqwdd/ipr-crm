import { useAppSelector } from '@/app';
import { Test } from '@/entities/test/types/types';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useMemo } from 'react';

interface TestConfirmProps {
  test: Test;
  onFinish?: () => void;
}

export default function TestConfirm({ test, onFinish }: TestConfirmProps) {
  const answers = useAppSelector((state) => state.testAssesment.answers);
  const errors = useAppSelector((state) => state.testAssesment.errors);

  const allQuestionsAnswered = useMemo(() => {
    let requiredNotAnswered = false;
    test.testQuestions.forEach((question, index) => {
      if (question.required && !answers[index]) {
        requiredNotAnswered = true;
      } else if (question.required && answers[index]) {
        if (question.type === 'MULTIPLE' || question.type === 'SINGLE') {
          if (answers[index].optionAnswer?.length === 0) {
            requiredNotAnswered = true;
            console.log(question);
          }
        } else if (question.type === 'NUMBER') {
          if (!answers[index].numberAnswer) {
            requiredNotAnswered = true;
            console.log(question);
          }
        } else if (question.type === 'TEXT') {
          if (!answers[index].textAnswer) {
            requiredNotAnswered = true;
            console.log(question);
          }
        }
      }
    });
    return !requiredNotAnswered;
  }, [answers, test]);

  return (
    <PrimaryButton
      onClick={onFinish}
      className="self-end mt-auto"
      disabled={!allQuestionsAnswered || Object.keys(errors).length > 0}
    >
      Завершить
    </PrimaryButton>
  );
}
