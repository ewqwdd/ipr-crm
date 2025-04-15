import { SurveyAnswer, SurveyQuestion } from '@/entities/survey';
import { Answer, Question } from '@/entities/test';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ChangeEvent } from 'react';

interface TextQuestionProps {
  question: Question | SurveyQuestion;
  answer: Answer | SurveyAnswer;
  onChange: (value: string) => void;
}

export default function TextQuestion({
  question,
  answer,
  onChange,
}: TextQuestionProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (question.maxLength) {
      value = value.slice(0, question.maxLength);
    }
    onChange(value);
  };

  return (
    <InputWithLabelLight value={answer?.textAnswer} onChange={handleChange} />
  );
}
