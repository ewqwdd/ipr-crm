import { SurveyAnswer, SurveyQuestion } from '@/entities/survey';
import { Answer, Question } from '@/entities/test';
import { digitRegex, floatRegex } from '@/shared/lib/regex';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ChangeEvent } from 'react';

interface NumberQuestionProps {
  question: Question | SurveyQuestion;
  onChange: (value: string) => void;
  answer: Answer | SurveyAnswer;
}

export default function NumberQuestion({
  question,
  answer,
  onChange,
}: NumberQuestionProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = question.allowDecimal ? floatRegex : digitRegex;
    if (value !== '') {
      if (!regex.test(value)) return;
      if (question.minNumber && Number(value) < question.minNumber) return;
      if (question.maxNumber && Number(value) > question.maxNumber) return;
    }
    onChange(value);
  };

  return (
    <InputWithLabelLight
      value={answer?.numberAnswer ?? ''}
      onChange={handleChange}
    />
  );
}
