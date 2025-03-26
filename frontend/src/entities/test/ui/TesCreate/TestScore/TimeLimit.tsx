import { useAppDispatch, useAppSelector } from '@/app';
import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { digitRegex } from '@/shared/lib/regex';
import { memo } from 'react';
import { testCreateActions } from '@/entities/test/testCreateSlice';

export default memo(function TimeLimit() {
  const limitByTime = useAppSelector((state) => state.testCreate.limitedByTime);
  const timeLimit = useAppSelector((state) => state.testCreate.timeLimit);
  const dispatch = useAppDispatch();

  const onChange = () => {
    dispatch(
      testCreateActions.setField({
        field: 'limitedByTime',
        value: !limitByTime,
      }),
    );
  };

  const onTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!digitRegex.test(value) && value !== '') return;
    dispatch(
      testCreateActions.setField({
        field: 'timeLimit',
        value: value,
      }),
    );
  };

  return (
    <>
      <Checkbox
        title="Ограничить время теста"
        onChange={onChange}
        checked={limitByTime}
        className="mt-8"
      />
      {limitByTime && (
        <InputWithLabelLight
          label="Время на тест (мин)"
          placeholder="60"
          value={timeLimit}
          onChange={onTimeLimitChange}
        />
      )}
    </>
  );
});
