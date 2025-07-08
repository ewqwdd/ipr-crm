import { Checkbox } from '@/shared/ui/Checkbox';
import { memo } from 'react';

interface ShuffleQuestionsProps {
  shuffleQuestions: boolean;
  onChange: () => void;
}

export default memo(function ShuffleQuestions({
  onChange,
  shuffleQuestions,
}: ShuffleQuestionsProps) {
  return (
    <div>
      <Checkbox
        onChange={onChange}
        checked={shuffleQuestions}
        title="Перемешать вопросы в тесте"
      />
    </div>
  );
});
