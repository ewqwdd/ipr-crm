import { TestOption } from '@/entities/test/types/types';
import OptionBase from './OptionBase';
import { Checkbox } from '@/shared/ui/Checkbox';
import { ChangeEvent } from 'react';

interface MultipleOptionProps {
  option: Omit<TestOption, 'id'>;
  correctRequired: boolean;
  index: number;
  questionIndex: number;
  onCorrectChange: (
    questionIndex: number,
    optionIndex: number,
    value: boolean,
  ) => void;
  onDeleteOption: (questionIndex: number, optionIndex: number) => void;
  onNameOptionChange: (
    questionIndex: number,
    optionIndex: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => void;
  onScoreChange: (
    questionIndex: number,
    optionIndex: number,
    value: number | undefined,
  ) => void;
}

export default function MultipleOption({
  option,
  correctRequired,
  index,
  questionIndex,
  onCorrectChange,
  onDeleteOption,
  onNameOptionChange,
  onScoreChange,
}: MultipleOptionProps) {
  const handleScoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== '') {
      if (isNaN(Number(value))) return;
      if (Number(value) < 0) return;
      onScoreChange?.(questionIndex, index, Number(value));
    }
  };

  return (
    <OptionBase
      correctRequired={correctRequired}
      onDelete={() => onDeleteOption(questionIndex, index)}
      option={option}
      onNameChange={(e) => onNameOptionChange(questionIndex, index, e)}
      radio={
        <>
          {option.isCorrect && (
            <input
              value={option.score}
              onChange={handleScoreChange}
              className="bg-white pl-1 pr-0 py-0.5 w-11"
              type="number"
            />
          )}

          <Checkbox
            title="Правильный ответ"
            checked={option.isCorrect}
            onChange={() =>
              onCorrectChange(questionIndex, index, !option.isCorrect)
            }
          />
        </>
      }
    />
  );
}
