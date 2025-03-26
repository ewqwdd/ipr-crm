import { Card } from '@/shared/ui/Card';
import QuestionTypeSelect from './QuesyionPartials/QuestionTypeSelect';
import { memo, useEffect, useState } from 'react';
import QuestionName from './QuesyionPartials/QuestionName';
import RequiredCheckbox from './QuesyionPartials/RequiredCheckbox';
import SetCorrectAnswer from './QuesyionPartials/SetCorrectAnswer';
import TestOptions from './QuesyionPartials/options/TestOptions';
import TextOptions from './QuesyionPartials/text/TextOptions';
import { useAppDispatch } from '@/app';
import { testCreateActions } from '../../../testCreateSlice';
import NumberOptions from './QuesyionPartials/number/NumberOptions';
import Error from './QuesyionPartials/Error';

interface QuestionProps {
  index: number;
}

export default memo(function Question({ index }: QuestionProps) {
  const [correctRequired, setCorrectRequired] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!correctRequired) {
      dispatch(testCreateActions.clearCorrectOptions(index));
    }
  }, [correctRequired, index, dispatch]);

  return (
    <Card className="[&>div]:flex [&>div]:flex-col [&>div]:gap-4">
      <QuestionTypeSelect index={index} />
      <QuestionName index={index} />
      <div className="flex gap-4 items-center">
        <RequiredCheckbox index={index} />
        <SetCorrectAnswer
          correctRequired={correctRequired}
          setCorrectRequired={setCorrectRequired}
        />
      </div>
      <TestOptions correctRequired={correctRequired} index={index} />
      <TextOptions correctRequired={correctRequired} index={index} />
      <NumberOptions correctRequired={correctRequired} index={index} />
      <Error index={index} />
    </Card>
  );
});
