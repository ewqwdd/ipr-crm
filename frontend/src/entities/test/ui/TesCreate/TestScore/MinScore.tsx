import { useAppDispatch, useAppSelector } from '@/app';
import { Checkbox } from '@/shared/ui/Checkbox';
import { memo, useState } from 'react';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { digitRegex } from '@/shared/lib/regex';
import { testCreateActions } from '@/entities/test/testCreateSlice';

export default memo(function MinScore() {
  const dispatch = useAppDispatch();
  const minimumScore = useAppSelector((state) => state.testCreate.minimumScore);
  const [checked, setChecked] = useState(false);

  const onToggleMinScore = () => {
    if (checked) {
      dispatch(
        testCreateActions.setField({
          field: 'minimumScore',
          value: undefined,
        }),
      );
    }
    setChecked(!checked);
  };

  const onMinScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!digitRegex.test(value) && value !== '') return;
    dispatch(
      testCreateActions.setField({
        field: 'minimumScore',
        value: value,
      }),
    );
  };

  return (
    <>
      <Checkbox
        title="Оценка результата зачет/незачет"
        checked={checked}
        onChange={onToggleMinScore}
      />
      {checked && (
        <InputWithLabelLight
          className="mb-2"
          label="Зачетный минимум"
          placeholder="0"
          value={minimumScore}
          onChange={onMinScoreChange}
        />
      )}
    </>
  );
});
