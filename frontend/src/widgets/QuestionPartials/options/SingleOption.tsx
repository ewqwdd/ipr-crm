import { TestOption } from '@/entities/test/types/types';
import { Radio } from '@/shared/ui/Radio';
import OptionBase from './OptionBase';
import { ChangeEvent } from 'react';
import { SurveyOption } from '@/entities/survey/types/types';

interface SingleOptionProps {
  option: Omit<TestOption | SurveyOption, 'id'>;
  correctRequired: boolean;
  index: number;
  questionIndex: number;
  onCorrectChange?: (
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
  onScoreChange?: (
    questionIndex: number,
    optionIndex: number,
    value: number | undefined,
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
  onScoreChange,
}: SingleOptionProps) {
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
          {(option as TestOption).isCorrect && (
            <input
              value={(option as TestOption).score}
              onChange={handleScoreChange}
              className="bg-white pl-1 pr-0 py-0.5 w-11"
              type="number"
            />
          )}
          {onCorrectChange && (
            <Radio
              checked={(option as TestOption).isCorrect}
              onChange={() => onCorrectChange(questionIndex, index, true)}
            >
              Правильный ответ
            </Radio>
          )}
        </>
      }
    />
  );
}
