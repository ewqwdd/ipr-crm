import { useAppDispatch, useAppSelector } from '@/app';
import { TestSettings } from '@/entities/test';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import React, { useCallback } from 'react';

export default function TestCreateSettings() {
  const dispatch = useAppDispatch();

  // fields
  const name = useAppSelector((state) => state.testCreate.name);
  const description = useAppSelector((state) => state.testCreate.description);
  const showScoreToUser = useAppSelector(
    (state) => state.testCreate.showScoreToUser,
  );
  const passedMessage = useAppSelector(
    (state) => state.testCreate.passedMessage,
  );

  // errors
  const errors = useAppSelector((state) => state.testCreate.errors);

  // handlers
  const onChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        testCreateActions.setField({ field: 'name', value: e.target.value }),
      );
      if (e.target.value.length === 0) {
        dispatch(
          testCreateActions.setError({
            field: 'name',
            error: 'Поле обязательно для заполнения',
          }),
        );
      } else {
        dispatch(
          testCreateActions.setError({ field: 'name', error: undefined }),
        );
      }
    },
    [dispatch],
  );

  const onChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(
        testCreateActions.setField({
          field: 'description',
          value: e.target.value,
        }),
      );
      if (e.target.value.length === 0) {
        dispatch(
          testCreateActions.setError({
            field: 'description',
            error: 'Поле обязательно для заполнения',
          }),
        );
      } else {
        dispatch(
          testCreateActions.setError({
            field: 'description',
            error: undefined,
          }),
        );
      }
    },
    [dispatch],
  );

  const onChangeShowScore = useCallback(() => {
    dispatch(
      testCreateActions.setField({
        field: 'showScoreToUser',
        value: !showScoreToUser,
      }),
    );
  }, [dispatch, showScoreToUser]);

  const onChangePassedMessage = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(
        testCreateActions.setField({
          field: 'passedMessage',
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  const props = {
    name,
    description,
    passedMessage,
    showScoreToUser,
    errors,
    onChangeName,
    onChangeDescription,
    onChangeShowScore,
    onChangePassedMessage,
  };

  return <TestSettings {...props} />;
}
