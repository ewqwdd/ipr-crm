import SingleOption from './SingleOption';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import MultipleOption from './MultipleOption';
import { CreateQuestion } from '@/entities/test/types/types';
import { CreateSurveyQuestion } from '@/entities/survey';

interface TestOptionsProps {
  index: number;
  correctRequired: boolean;
  questions: CreateQuestion[] | CreateSurveyQuestion[];
  handleAddOption: (index: number) => void;
  onCorrectChange?: (
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
  onScoreChange?: (
    questionIndex: number,
    optionIndex: number,
    value: number | undefined,
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
  onScoreChange,
}: TestOptionsProps) {
  const options = questions[index].options;
  const type = questions[index].type;

  if (!['SINGLE', 'MULTIPLE'].includes(type)) return null;

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
            onScoreChange={onScoreChange}
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
            onScoreChange={onScoreChange}
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
