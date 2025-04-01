import { Checkbox } from '@/shared/ui/Checkbox';
import { memo } from 'react';

interface SetCorrectAnswerProps {
  correctRequired: boolean;
  index: number;
  setCorrectRequired: (index: number, value: boolean) => void;
}

export default memo(function SetCorrectAnswer({
  correctRequired,
  index,
  setCorrectRequired,
}: SetCorrectAnswerProps) {
  return (
    <Checkbox
      checked={correctRequired}
      onChange={() => setCorrectRequired(index, !correctRequired)}
      title="Указать правильный ответ"
    />
  );
});
