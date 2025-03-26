import { useAppDispatch, useAppSelector } from '@/app';
import SingleOption from './SingleOption';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import MultipleOption from './MultipleOption';

interface TestOptionsProps {
  index: number;
  correctRequired: boolean;
}

export default function TestOptions({
  index,
  correctRequired,
}: TestOptionsProps) {
  const options = useAppSelector(
    (state) => state.testCreate.questions[index].options,
  );
  const type = useAppSelector(
    (state) => state.testCreate.questions[index].type,
  );
  const dispatch = useAppDispatch();

  const handleAddOption = () => {
    dispatch(testCreateActions.addOption({ index }));
  };

  if (['TEXT', 'NUMBER'].includes(type)) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {type === 'SINGLE' &&
        options?.map((option, optionIndex) => (
          <SingleOption
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
            index={optionIndex}
            key={optionIndex}
            option={option}
            correctRequired={correctRequired}
            questionIndex={index}
          />
        ))}
      <SecondaryButton
        onClick={handleAddOption}
        size="xs"
        className="self-start mt-5"
      >
        Добавить вариант ответа
      </SecondaryButton>
    </div>
  );
}
