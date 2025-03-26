import { useAppDispatch } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { TestOption } from '@/entities/test/types/types';
import { Radio } from '@/shared/ui/Radio';
import OptionBase from './OptionBase';

interface SingleOptionProps {
  option: TestOption;
  correctRequired: boolean;
  index: number;
  questionIndex: number;
}

export default function SingleOption({
  option,
  correctRequired,
  index,
  questionIndex,
}: SingleOptionProps) {
  const dispatch = useAppDispatch();

  const onCorrectChange = () => {
    dispatch(
      testCreateActions.setOptionIsCorrect({
        optionIndex: index,
        index: questionIndex,
        value: true,
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
        <Radio checked={option.isCorrect} onChange={onCorrectChange}>
          Правильный ответ
        </Radio>
      }
    />
  );
}
