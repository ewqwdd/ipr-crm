import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import TestScore from '@/entities/test/ui/TesCreate/TestScore/TestScore';
import { useCallback } from 'react';

export default function TestScoreCreate() {
  const dispatch = useAppDispatch();
  const timeLimit = useAppSelector((state) => state.testCreate.timeLimit);
  const limitedByTime = useAppSelector(
    (state) => state.testCreate.limitedByTime,
  );
  const minimumScore = useAppSelector((state) => state.testCreate.minimumScore);
  const questions = useAppSelector((state) => state.testCreate.questions);

  const onTimeLimitToggle = useCallback(
    (value: boolean) => {
      dispatch(
        testCreateActions.setField({
          field: 'limitedByTime',
          value,
        }),
      );
    },
    [dispatch],
  );

  const onTimeLimitChange = useCallback(
    (value: string) => {
      dispatch(
        testCreateActions.setField({
          field: 'timeLimit',
          value: value,
        }),
      );
    },
    [dispatch],
  );

  const onChangeMinimumScore = useCallback(
    (value?: string) => {
      dispatch(
        testCreateActions.setField({
          field: 'minimumScore',
          value,
        }),
      );
    },
    [dispatch],
  );

  const props = {
    questions,
    limitByTime: !!limitedByTime,
    timeLimit: timeLimit,
    onToggleLimitByTime: onTimeLimitToggle,
    onTimeLimitChange: onTimeLimitChange,
    minimumScore: minimumScore,
    onChangeMinimumScore: onChangeMinimumScore,
  };

  return <TestScore {...props} />;
}
