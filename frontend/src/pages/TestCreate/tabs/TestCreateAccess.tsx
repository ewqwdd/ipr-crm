import { useAppDispatch, useAppSelector } from '@/app';
import { TestAccess } from '@/entities/test';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { useCallback } from 'react';
import { DateObject } from 'react-multi-date-picker';

export default function TestCreateAccess() {
  const dispatch = useAppDispatch();

  const access =
    useAppSelector((state) => state.testCreate.access) ?? 'PRIVATE';
  const anonymous = useAppSelector((state) => !!state.testCreate.anonymous);
  const startDate = useAppSelector((state) => state.testCreate.startDate);
  const endDate = useAppSelector((state) => state.testCreate.endDate);

  const onChangeAccess = useCallback(
    (key: string) => {
      dispatch(testCreateActions.setField({ field: 'access', value: key }));
    },
    [dispatch],
  );

  const onChangeAnonymous = useCallback(
    (key: string) => {
      dispatch(
        testCreateActions.setField({
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
      testCreateActions.setField({ field: 'endDate', value: date?.toDate() }),
    );
  };

  const onChangeStartDate = useCallback(
    (date?: DateObject | DateObject[]) => {
      if (Array.isArray(date)) {
        return;
      }
      dispatch(
        testCreateActions.setField({
          field: 'startDate',
          value: date?.toDate(),
        }),
      );
    },
    [dispatch],
  );

  const onClearEndDate = useCallback(() => {
    dispatch(
      testCreateActions.setField({
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
}
