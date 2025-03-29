import { useAppDispatch, useAppSelector } from '@/app';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { Question } from '@/entities/test/types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ChangeEvent } from 'react';
import { answerQuestion } from '../answerQuestion';

interface TextQuestionProps {
  index: number;
  question: Question;
  testId: number;
}

export default function TextQuestion({
  index,
  question,
  testId,
}: TextQuestionProps) {
  const dispatch = useAppDispatch();
  const answer = useAppSelector((state) => state.testAssesment.answers[index]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (question.maxLength) {
      value = value.slice(0, question.maxLength);
    }

    const answer = {
      textAnswer: value,
    };

    dispatch(testAssesmentActions.setAnswer({ index, value: answer }));
    answerQuestion(testId, question.id, answer);
  };

  return <InputWithLabelLight value={answer?.textAnswer} onChange={onChange} />;
}
