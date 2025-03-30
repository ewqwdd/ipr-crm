import { useAppDispatch, useAppSelector } from '@/app';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { Question } from '@/entities/test/types/types';
import { digitRegex, floatRegex } from '@/shared/lib/regex';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ChangeEvent } from 'react';
import { answerQuestion } from '../answerQuestion';

interface NumberQuestionProps {
  index: number;
  question: Question;
  testId: number;
}

export default function NumberQuestion({
  index,
  question,
  testId,
}: NumberQuestionProps) {
  const dispatch = useAppDispatch();
  const answer = useAppSelector((state) => state.testAssesment.answers[index]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = question.allowDecimal ? floatRegex : digitRegex;
    if (value !== '') {
      if (!regex.test(value)) return;
      if (question.minNumber && Number(value) < question.minNumber) return;
      if (question.maxNumber && Number(value) > question.maxNumber) return;
    }

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

  return (
    <InputWithLabelLight
      value={answer?.numberAnswer ?? ''}
      onChange={onChange}
    />
  );
}
