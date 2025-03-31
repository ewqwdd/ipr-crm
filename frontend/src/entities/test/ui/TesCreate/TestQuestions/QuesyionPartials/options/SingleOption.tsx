import { TestOption } from '@/entities/test/types/types';
import { Radio } from '@/shared/ui/Radio';
import OptionBase from './OptionBase';
import { ChangeEvent } from 'react';

interface SingleOptionProps {
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

export default function SingleOption({
  option,
  correctRequired,
  index,
  questionIndex,
  onCorrectChange,
  onDeleteOption,
  onNameOptionChange,
}: SingleOptionProps) {
  return (
    <OptionBase
      correctRequired={correctRequired}
      onDelete={() => onDeleteOption(questionIndex, index)}
      option={option}
      onNameChange={(e) => onNameOptionChange(questionIndex, index, e)}
      radio={
        <Radio
          checked={option.isCorrect}
          onChange={() => onCorrectChange(questionIndex, index)}
        >
          Правильный ответ
        </Radio>
      }
    />
  );
}
