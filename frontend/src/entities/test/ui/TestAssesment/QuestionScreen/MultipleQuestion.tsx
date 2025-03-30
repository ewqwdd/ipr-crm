import { useAppDispatch, useAppSelector } from '@/app';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { Question } from '@/entities/test/types/types';
import { Checkbox } from '@/shared/ui/Checkbox';
import { answerQuestion } from '../answerQuestion';

interface MultipleQuestionProps {
  index: number;
  question: Question;
  testId: number;
}

export default function MultipleQuestion({
  index,
  question,
  testId,
}: MultipleQuestionProps) {
  const answer = useAppSelector((state) => state.testAssesment.answers[index]);
  const dispatch = useAppDispatch();

  const onChange = (optionId: number) => {
    const prev = answer?.optionAnswer || [];
    const newAnswer = {
      optionAnswer: prev?.includes(optionId)
        ? prev?.filter((id) => id !== optionId)
        : [...(prev || []), optionId],
    };
    dispatch(testAssesmentActions.setAnswer({ index, value: newAnswer }));
    answerQuestion(testId, question.id, newAnswer);
  };

  return (
    <div className="flex flex-col gap-2">
      {question?.options?.map((option) => (
        <Checkbox
          onChange={() => onChange(option.id)}
          key={option.id}
          title={option.value}
          checked={answer?.optionAnswer?.includes(option.id)}
        />
      ))}
    </div>
  );
}
