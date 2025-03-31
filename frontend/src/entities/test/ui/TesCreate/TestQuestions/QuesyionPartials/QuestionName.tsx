import { CreateQuestion } from '@/entities/test/types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { memo } from 'react';

interface QuestionNameProps {
  index: number;
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  questions: CreateQuestion[];
}

export default memo(function QuestionName({
  index,
  onChange,
  questions,
}: QuestionNameProps) {
  const label = questions[index].label;

  return (
    <InputWithLabelLight
      label="Название вопроса"
      value={label}
      onChange={(e) => onChange(index, e)}
    />
  );
});
