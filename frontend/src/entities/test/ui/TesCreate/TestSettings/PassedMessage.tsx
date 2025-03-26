import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { TextArea } from '@/shared/ui/TextArea';

export default function PassedMessage() {
  const passedMessage = useAppSelector(
    (state) => state.testCreate.passedMessage,
  );
  const error = useAppSelector(
    (state) => state.testCreate.errors.passedMessage,
  );
  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      testCreateActions.setField({
        field: 'passedMessage',
        value: e.target.value,
      }),
    );
  };

  return (
    <TextArea
      label="Сообщение при завершении прохождения"
      onChange={onChange}
      value={passedMessage}
      error={error}
    />
  );
}
