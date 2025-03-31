import { TestOption } from '@/entities/test/types/types';
import OptionBase from './OptionBase';
import { Checkbox } from '@/shared/ui/Checkbox';
import { ChangeEvent } from 'react';

interface MultipleOptionProps {
  option: Omit<TestOption, 'id'>;
  correctRequired: boolean;
  index: number;
  questionIndex: number;
  onCorrectChange: (questionIndex: number, optionIndex: number) => void;
  onDeleteOption: (questionIndex: number, optionIndex: number) => void;
  onNameOptionChange: (
    questionIndex: number,
    optionIndex: number,
    e: ChangeEvent<HTMLInputElement>,
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
}: MultipleOptionProps) {
  return (
    <OptionBase
      correctRequired={correctRequired}
      onDelete={() => onDeleteOption(questionIndex, index)}
      option={option}
      onNameChange={(e) => onNameOptionChange(questionIndex, index, e)}
      radio={
        <Checkbox
          title="Правильный ответ"
          checked={option.isCorrect}
          onChange={() => onCorrectChange(questionIndex, index)}
        />
      }
    />
  );
}
