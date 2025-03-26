import { Checkbox } from '@/shared/ui/Checkbox';
import { Dispatch, memo, SetStateAction } from 'react';

interface SetCorrectAnswerProps {
  correctRequired: boolean;
  setCorrectRequired: Dispatch<SetStateAction<boolean>>;
}

export default memo(function SetCorrectAnswer({
  correctRequired,
  setCorrectRequired,
}: SetCorrectAnswerProps) {
  return (
    <Checkbox
      checked={correctRequired}
      onChange={() => setCorrectRequired((p) => !p)}
      title="Указать правильный ответ"
    />
  );
});
