import { useAppDispatch, useAppSelector } from '@/app';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { Question } from '@/entities/test/types/types';
import { Radio } from '@/shared/ui/Radio';
import { answerQuestion } from '../answerQuestion';

interface SingleQuestionProps {
  index: number;
  question: Question;
  testId: number;
}

export default function SingleQuestion({
  index,
  question,
  testId,
}: SingleQuestionProps) {
  const answer = useAppSelector((state) => state.testAssesment.answers[index]);
  const dispatch = useAppDispatch();

  const onChange = (optionId: number) => {
    const answer = {
      optionAnswer: [optionId],
    };
    dispatch(testAssesmentActions.setAnswer({ index, value: answer }));
    answerQuestion(testId, question.id, answer);
  };

  return (
    <div className="flex flex-col gap-2">
      {question?.options?.map((option) => (
        <Radio
          onChange={() => onChange(option.id)}
          key={option.id}
          checked={answer?.optionAnswer?.includes(option.id)}
        >
          {option.value}
        </Radio>
      ))}
    </div>
  );
}
