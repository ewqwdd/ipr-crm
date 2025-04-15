import { Checkbox } from '@/shared/ui/Checkbox';
import { SurveyAnswer, SurveyQuestion } from '@/entities/survey';
import { Answer, Question } from '@/entities/test';

interface MultipleQuestionProps {
  question: Question | SurveyQuestion;
  answer: SurveyAnswer | Answer;
  onChange: (options: number[]) => void;
}

export default function MultipleQuestion({
  question,
  answer,
  onChange,
}: MultipleQuestionProps) {
  const handleChange = (optionId: number) => {
    const prev = answer?.optionAnswer || [];
    const newAnswer = prev?.includes(optionId)
      ? prev?.filter((id) => id !== optionId)
      : [...(prev || []), optionId];
    onChange(newAnswer);
  };

  return (
    <div className="flex flex-col gap-2">
      {question?.options?.map((option) => (
        <Checkbox
          onChange={() => handleChange(option.id)}
          key={option.id}
          title={option.value}
          checked={answer?.optionAnswer?.includes(option.id)}
        />
      ))}
    </div>
  );
}
