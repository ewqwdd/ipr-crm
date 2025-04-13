import { SelectLight } from '@/shared/ui/SelectLight';
import { memo } from 'react';
import {
  CreateSurveyQuestion,
  surveyQuestionTypeLabels,
  surveyQuestionTypes,
} from '../types/types';

interface SurveyQuestionTypeSelectProps {
  index: number;
  questions: CreateSurveyQuestion[];
  onChange: (index: number, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default memo(function SurveyQuestionTypeSelect({
  index,
  questions,
  onChange,
}: SurveyQuestionTypeSelectProps) {
  const type = questions[index].type;

  return (
    <SelectLight
      containerClassName="flex-1"
      value={type}
      onChange={(e) => onChange(index, e)}
    >
      {surveyQuestionTypes.map((type) => (
        <option key={type} value={type}>
          {surveyQuestionTypeLabels[type]}
        </option>
      ))}
    </SelectLight>
  );
});
