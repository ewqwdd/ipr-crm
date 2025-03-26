import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';

export default function TaskName() {
  const name = useAppSelector((state) => state.testCreate.name);
  const error = useAppSelector((state) => state.testCreate.errors.name);
  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      testCreateActions.setField({ field: 'name', value: e.target.value }),
    );
    if (e.target.value.length === 0) {
      dispatch(
        testCreateActions.setError({
          field: 'name',
          error: 'Поле обязательно для заполнения',
        }),
      );
    } else {
      dispatch(testCreateActions.setError({ field: 'name', error: undefined }));
    }
  };

  return (
    <InputWithLabelLight
      label="Название теста"
      onChange={onChange}
      value={name}
      error={error}
    />
  );
}
