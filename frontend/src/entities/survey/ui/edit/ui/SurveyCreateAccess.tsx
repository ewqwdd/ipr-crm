import { useAppDispatch, useAppSelector } from '@/app';
import { surveyCreateActions } from '@/entities/survey';
import { TestAccess } from '@/widgets/TestAccess';
import { memo, useCallback } from 'react';
import { DateObject } from 'react-multi-date-picker';

export default memo(function SurveyCreateAccess() {
  const dispatch = useAppDispatch();

  const access =
    useAppSelector((state) => state.surveyCreate.access) ?? 'PRIVATE';
  const anonymous = useAppSelector((state) => !!state.surveyCreate.anonymous);
  const startDate = useAppSelector((state) => state.surveyCreate.startDate);
  const endDate = useAppSelector((state) => state.surveyCreate.endDate);

  const onChangeAccess = useCallback(
    (key: string) => {
      dispatch(surveyCreateActions.setField({ field: 'access', value: key }));
    },
    [dispatch],
  );

  const onChangeAnonymous = useCallback(
    (key: string) => {
      dispatch(
        surveyCreateActions.setField({
          field: 'anonymous',
          value: key === 'true',
        }),
      );
    },
    [dispatch],
  );

  const onChangeEndDate = (date?: DateObject | DateObject[]) => {
    if (Array.isArray(date)) {
      return;
    }
    dispatch(
      surveyCreateActions.setField({ field: 'endDate', value: date?.toDate() }),
    );
  };

  const onChangeStartDate = useCallback(
    (date?: DateObject | DateObject[]) => {
      if (Array.isArray(date)) {
        return;
      }
      dispatch(
        surveyCreateActions.setField({
          field: 'startDate',
          value: date?.toDate(),
        }),
      );
    },
    [dispatch],
  );

  const onClearEndDate = useCallback(() => {
    dispatch(
      surveyCreateActions.setField({
        field: 'endDate',
        value: undefined,
      }),
    );
  }, [dispatch]);

  return (
    <TestAccess
      endDate={endDate}
      startDate={startDate}
      anonymous={anonymous}
      access={access}
      onChangeAccess={onChangeAccess}
      onChangeAnonymous={onChangeAnonymous}
      onChangeEndDate={onChangeEndDate}
      onChangeStartDate={onChangeStartDate}
      onClearEndDate={onClearEndDate}
    />
  );
});
