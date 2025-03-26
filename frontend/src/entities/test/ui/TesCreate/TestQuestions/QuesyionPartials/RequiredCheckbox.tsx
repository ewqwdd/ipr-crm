import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { Checkbox } from '@/shared/ui/Checkbox';
import { memo } from 'react';

interface RequiredCheckboxProps {
  index: number;
}

export default memo(function RequiredCheckbox({
  index,
}: RequiredCheckboxProps) {
  const dispatch = useAppDispatch();
  const required = useAppSelector(
    (state) => state.testCreate.questions[index].required,
  );

  const onChange = () => {
    dispatch(
      testCreateActions.setQuestionField({
        index,
        field: 'required',
        value: !required,
      }),
    );
  };

  return (
    <Checkbox
      checked={required}
      onChange={onChange}
      title="Обязательное поле"
    />
  );
});
