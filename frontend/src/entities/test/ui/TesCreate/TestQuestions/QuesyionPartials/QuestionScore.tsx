import { CreateQuestion } from '@/entities/test/types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { memo } from 'react';

interface QuestionScoreProps {
  index: number;
  onChange: (index: number, e: number) => void;
  questions: CreateQuestion[];
}

export default memo(function QuestionScore({
  index,
  onChange,
  questions,
}: QuestionScoreProps) {
  const question = questions[index];
  const score = question.score;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || isNaN(Number(value)) || Number(value) < 0) {
      onChange(index, 0);
    } else {
      onChange(index, Number(value.replace('.', '')));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.' || e.key === ',') {
      e.preventDefault();
    }
  };

  if (question.type === 'SINGLE' || question.type === 'MULTIPLE') return null;

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-500">Баллы:</span>
      <InputWithLabelLight
        className="w-14 [&>input]:pr-0"
        type="number"
        value={score}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
});
