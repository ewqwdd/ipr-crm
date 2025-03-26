import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { Checkbox } from '@/shared/ui/Checkbox';

export default function ShowScoreToUser() {
  const showScoreToUser = useAppSelector(
    (state) => state.testCreate.showScoreToUser,
  );
  const dispatch = useAppDispatch();

  const onChange = () => {
    dispatch(
      testCreateActions.setField({
        field: 'showScoreToUser',
        value: !showScoreToUser,
      }),
    );
  };

  return (
    <div>
      <Checkbox
        onChange={onChange}
        checked={showScoreToUser}
        title="Показывать результат пользователю"
      />
    </div>
  );
}
