import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ChangeEvent } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface PhoneQuestionProps {
  answer: { phoneAnswer?: string };
  onChange: (value: string, error?: boolean) => void;
  error?: string;
  setError?: (error?: string) => void;
}

export default function PhoneQuestion({
  answer,
  onChange,
  error,
  setError,
}: PhoneQuestionProps) {
  const value = answer?.phoneAnswer || '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    const hasError = !!val && !isValidPhoneNumber(val);

    onChange(val, hasError);

    if (setError) {
      if (hasError) {
        setError('Введите корректный номер телефона с кодом страны');
      } else {
        setError();
      }
    }
  };

  return (
    <div>
      <InputWithLabelLight
        value={value}
        onChange={handleChange}
        placeholder="+7 999 123 45 67"
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
