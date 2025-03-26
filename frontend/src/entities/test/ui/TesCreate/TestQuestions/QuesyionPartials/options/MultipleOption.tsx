import { useAppDispatch } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { TestOption } from '@/entities/test/types/types';
import OptionBase from './OptionBase';
import { Checkbox } from '@/shared/ui/Checkbox';

interface MultipleOptionProps {
  option: TestOption;
  correctRequired: boolean;
  index: number;
  questionIndex: number;
}

export default function MultipleOption({
  option,
  correctRequired,
  index,
  questionIndex,
}: MultipleOptionProps) {
  const dispatch = useAppDispatch();

  const onCorrectChange = () => {
    dispatch(
      testCreateActions.setOptionIsCorrect({
        optionIndex: index,
        index: questionIndex,
        value: !option.isCorrect,
      }),
    );
  };

  const onDelete = () => {
    dispatch(
      testCreateActions.deleteOption({
        index: questionIndex,
        optionIndex: index,
      }),
    );
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      testCreateActions.setOptionName({
        index: questionIndex,
        optionIndex: index,
        value: e.target.value,
      }),
    );
  };

  return (
    <OptionBase
      correctRequired={correctRequired}
      onDelete={onDelete}
      option={option}
      onNameChange={onNameChange}
      radio={
        <Checkbox
          title="Правильный ответ"
          checked={option.isCorrect}
          onChange={onCorrectChange}
        />
      }
    />
  );
}
