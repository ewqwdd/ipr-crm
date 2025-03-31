import { CreateQuestion } from '@/entities/test/types/types';
import { Checkbox } from '@/shared/ui/Checkbox';
import { memo } from 'react';

interface RequiredCheckboxProps {
  index: number;
  questions: CreateQuestion[];
  onChange: (index: number, value: boolean) => void;
}

export default memo(function RequiredCheckbox({
  index,
  onChange,
  questions,
}: RequiredCheckboxProps) {
  const required = questions[index].required;

  return (
    <Checkbox
      checked={required}
      onChange={() => onChange(index, !required)}
      title="Обязательное поле"
    />
  );
});
