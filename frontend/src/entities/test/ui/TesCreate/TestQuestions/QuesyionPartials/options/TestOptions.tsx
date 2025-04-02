import SingleOption from './SingleOption';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import MultipleOption from './MultipleOption';
import { CreateQuestion } from '@/entities/test/types/types';

interface TestOptionsProps {
  index: number;
  correctRequired: boolean;
  questions: CreateQuestion[];
  handleAddOption: (index: number) => void;
  onCorrectChange: (
    questionIndex: number,
    optionIndex: number,
    value: boolean,
  ) => void;
  onDeleteOption: (questionIndex: number, optionIndex: number) => void;
  onNameOptionChange: (
    questionIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export default function TestOptions({
  index,
  correctRequired,
  handleAddOption,
  questions,
  onCorrectChange,
  onDeleteOption,
  onNameOptionChange,
}: TestOptionsProps) {
  const options = questions[index].options;
  const type = questions[index].type;

  if (['TEXT', 'NUMBER'].includes(type)) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {type === 'SINGLE' &&
        options?.map((option, optionIndex) => (
          <SingleOption
            onNameOptionChange={onNameOptionChange}
            onDeleteOption={onDeleteOption}
            onCorrectChange={onCorrectChange}
            index={optionIndex}
            key={optionIndex}
            option={option}
            correctRequired={correctRequired}
            questionIndex={index}
          />
        ))}
      {type === 'MULTIPLE' &&
        options?.map((option, optionIndex) => (
          <MultipleOption
            onNameOptionChange={onNameOptionChange}
            onDeleteOption={onDeleteOption}
            onCorrectChange={onCorrectChange}
            index={optionIndex}
            key={optionIndex}
            option={option}
            correctRequired={correctRequired}
            questionIndex={index}
          />
        ))}
      <SecondaryButton
        onClick={() => handleAddOption(index)}
        size="xs"
        className="self-start mt-5"
      >
        Добавить вариант ответа
      </SecondaryButton>
    </div>
  );
}
