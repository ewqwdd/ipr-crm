import {
  CreateQuestion,
  questionTypeLabels,
  questionTypes,
} from '@/entities/test/types/types';
import { SelectLight } from '@/shared/ui/SelectLight';
import { memo } from 'react';

interface QuestionTypeProps {
  index: number;
  questions: CreateQuestion[];
  onChange: (index: number, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default memo(function QuestionTypeSelect({
  index,
  questions,
  onChange,
}: QuestionTypeProps) {
  const type = questions[index].type;

  return (
    <SelectLight
      containerClassName="flex-1"
      value={type}
      onChange={(e) => onChange(index, e)}
    >
      {questionTypes.map((type) => (
        <option key={type} value={type}>
          {questionTypeLabels[type]}
        </option>
      ))}
    </SelectLight>
  );
});
