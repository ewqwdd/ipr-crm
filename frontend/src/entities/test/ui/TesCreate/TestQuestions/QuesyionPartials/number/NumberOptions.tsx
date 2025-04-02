import { CreateQuestion } from '@/entities/test/types/types';
import { cva } from '@/shared/lib/cva';
import { digitRegex, floatRegex } from '@/shared/lib/regex';
import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useEffect, useState } from 'react';

interface NumberOptionsProps {
  index: number;
  correctRequired: boolean;
  questions: CreateQuestion[];
  onNumberCorrectChange: (index: number, value: string) => void;
  onAllowDecimalChange: (index: number, value: boolean) => void;
  onMaxNumberChange: (index: number, value: string | undefined) => void;
  onMinNumberChange: (index: number, value: string | undefined) => void;
  setMaxMinToggle: (index: number, value: boolean) => void;
}

export default function NumberOptions({
  index,
  correctRequired,
  onNumberCorrectChange,
  questions,
  onAllowDecimalChange,
  onMaxNumberChange,
  onMinNumberChange,
  setMaxMinToggle,
}: NumberOptionsProps) {
  const type = questions[index].type;
  const allowDecimal = questions[index].allowDecimal;
  const minValueInit = questions[index].minNumber;
  const maxValueInit = questions[index].maxNumber;

  const numberCorrectValue = questions[index].numberCorrectValue?.toString();

  const maxLengthToggle = questions[index].maxMinToggle;

  const [minValue, setMinValue] = useState(minValueInit?.toString() ?? '');
  const [maxValue, setMaxValue] = useState(maxValueInit?.toString() ?? '');

  const onChangeCorrect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = allowDecimal ? floatRegex : digitRegex;
    if (!regex.test(value) && value !== '') return;
    onNumberCorrectChange(index, value);
  };

  const allowDecimalChange = () => {
    onAllowDecimalChange(index, !allowDecimal);
  };

  useEffect(() => {
    if (!allowDecimal) {
      onNumberCorrectChange(index, (numberCorrectValue ?? '')?.split('.')[0]);
    }
  }, [allowDecimal, numberCorrectValue, index, onNumberCorrectChange]);

  useEffect(() => {
    if (maxLengthToggle) {
      onMaxNumberChange(index, maxValue);
      onMinNumberChange(index, minValue);
    } else {
      onMaxNumberChange(index, undefined);
      onMinNumberChange(index, undefined);
    }
  }, [
    maxLengthToggle,
    minValue,
    maxValue,
    index,
    onMaxNumberChange,
    onMinNumberChange,
  ]);

  const onChangeMinValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (digitRegex.test(value) || value === '') {
      setMinValue(value);
    }
  };

  const onChangeMaxValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (digitRegex.test(value) || value === '') {
      setMaxValue(value);
    }
  };

  if (type !== 'NUMBER') return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Checkbox
        title="Разрешить десятичные"
        checked={allowDecimal}
        onChange={allowDecimalChange}
      />
      <div className="flex gap-4 items-center">
        <Checkbox
          title="Мин/макс значение"
          checked={maxLengthToggle}
          onChange={() => setMaxMinToggle(index, !maxLengthToggle)}
        />

        <InputWithLabelLight
          className={cva('transition-opacity max-w-20 ml-4', {
            'opacity-50': !maxLengthToggle,
          })}
          placeholder={'0'}
          value={minValue}
          onChange={onChangeMinValue}
          disabled={!maxLengthToggle}
        />

        <InputWithLabelLight
          className={cva('transition-opacity max-w-20', {
            'opacity-50': !maxLengthToggle,
          })}
          placeholder={'8'}
          value={maxValue}
          onChange={onChangeMaxValue}
          disabled={!maxLengthToggle}
        />
      </div>

      {correctRequired && (
        <InputWithLabelLight
          label="Правильный ответ"
          onChange={onChangeCorrect}
          value={numberCorrectValue}
        />
      )}
    </div>
  );
}
