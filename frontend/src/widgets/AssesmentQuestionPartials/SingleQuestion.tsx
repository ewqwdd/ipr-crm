import { Radio } from '@/shared/ui/Radio';
import { SurveyAnswer } from '@/entities/survey';
import { Answer, Question } from '@/entities/test';
import { SurveyQuestion } from '@/entities/survey/types/types';

interface SingleQuestionProps {
  question: Question | SurveyQuestion;
  onChange: (optionId: number) => void;
  answer: SurveyAnswer | Answer;
}

export default function SingleQuestion({
  question,
  answer,
  onChange,
}: SingleQuestionProps) {
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
