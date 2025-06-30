import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ChangeEvent } from 'react';

interface TimeQuestionProps {
  answer: { timeAnswer?: string };
  onChange: (value: string, error?: boolean) => void;
  error?: string;
  setError?: (error?: string) => void;
}

const isValidTime = (value: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(value);
};

export default function TimeQuestion({
  answer,
  onChange,
  error,
  setError,
}: TimeQuestionProps) {
  const value = answer?.timeAnswer || '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const hasError = val.length > 0 && !isValidTime(val);

    onChange(val, hasError);

    if (setError) {
      if (hasError) {
        setError('Введите корректное время в формате HH:MM');
      } else {
        setError();
      }
    }
  };

  return (
    <div>
      <InputWithLabelLight
        type="time"
        value={value}
        onChange={handleChange}
        placeholder="HH:MM"
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
