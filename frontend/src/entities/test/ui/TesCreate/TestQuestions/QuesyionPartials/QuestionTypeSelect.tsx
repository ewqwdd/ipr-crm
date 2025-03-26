import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import {
  QuestionType,
  questionTypeLabels,
  questionTypes,
} from '@/entities/test/types/types';
import { SelectLight } from '@/shared/ui/SelectLight';
import { memo } from 'react';

interface QuestionTypeProps {
  index: number;
}

export default memo(function QuestionTypeSelect({ index }: QuestionTypeProps) {
  const dispatch = useAppDispatch();
  const type = useAppSelector(
    (state) => state.testCreate.questions[index].type,
  );

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      testCreateActions.setQuestionField({
        index,
        field: 'type',
        value: e.target.value as QuestionType,
      }),
    );
  };

  return (
    <SelectLight value={type} onChange={onChange}>
      {questionTypes.map((type) => (
        <option key={type} value={type}>
          {questionTypeLabels[type]}
        </option>
      ))}
    </SelectLight>
  );
});
