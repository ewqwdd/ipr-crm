import { SurveyAnswer, SurveyQuestion } from '@/entities/survey';
import { Answer, Question } from '@/entities/test';
import { digitRegex, floatRegex } from '@/shared/lib/regex';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ChangeEvent, useEffect } from 'react';

interface NumberQuestionProps {
  question: Question | SurveyQuestion;
  onChange: (value: string) => void;
  answer: Answer | SurveyAnswer;
  error?: string;
  setError?: (error?: string) => void;
}

export default function NumberQuestion({
  question,
  answer,
  onChange,
  error,
  setError,
}: NumberQuestionProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = question.allowDecimal ? floatRegex : digitRegex;
    if (value !== '') {
      if (!regex.test(value)) return;
      // if (question.minNumber && Number(value) < question.minNumber) return;
      if (question.maxNumber && Number(value) > question.maxNumber) return;
    }
    onChange(value);
  };

  useEffect(() => {
    if (!answer?.numberAnswer && !question.required) {
      setError?.();
      return;
    }
    if (
      question.minNumber &&
      Number(answer?.numberAnswer) < question.minNumber
    ) {
      setError?.(`Минимальное значение: ${question.minNumber}`);
      return;
    }
    if (
      question.maxNumber &&
      Number(answer?.numberAnswer) > question.maxNumber
    ) {
      setError?.(`Максимальное значение: ${question.maxNumber}`);
      return;
    }
    setError?.();
  }, [question.minNumber, question.maxNumber, answer, setError]);

  return (
    <div className="flex flex-col gap-2">
      <InputWithLabelLight
        value={answer?.numberAnswer ?? ''}
        onChange={handleChange}
      />
      <p className="text-sm text-gray-500 flex justify-between">
        <span>
          {Number.isInteger(question.minNumber) && `Мин: ${question.minNumber}`}
        </span>
        <span>
          {Number.isInteger(question.maxNumber) &&
            `Макс: ${question.maxNumber}`}
        </span>
      </p>
      {error && (
        <p className="text-sm font-medium text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
