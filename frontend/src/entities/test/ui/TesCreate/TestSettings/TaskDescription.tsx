import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { TextArea } from '@/shared/ui/TextArea';

export default function TaskDescription() {
  const description = useAppSelector((state) => state.testCreate.description);
  const error = useAppSelector((state) => state.testCreate.errors.description);
  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      testCreateActions.setField({
        field: 'description',
        value: e.target.value,
      }),
    );
    if (e.target.value.length === 0) {
      dispatch(
        testCreateActions.setError({
          field: 'description',
          error: 'Поле обязательно для заполнения',
        }),
      );
    } else {
      dispatch(
        testCreateActions.setError({ field: 'description', error: undefined }),
      );
    }
  };

  return (
    <TextArea
      label="Описание"
      onChange={onChange}
      value={description}
      error={error}
    />
  );
}
