import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { memo } from 'react';

interface QuestionNameProps {
  index: number;
}

export default memo(function QuestionName({ index }: QuestionNameProps) {
  const dispatch = useAppDispatch();
  const label = useAppSelector(
    (state) => state.testCreate.questions[index].label,
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      testCreateActions.setQuestionField({
        index,
        field: 'label',
        value: e.target.value,
      }),
    );
  };

  return (
    <InputWithLabelLight
      label="Название вопроса"
      value={label}
      onChange={onChange}
    />
  );
});
