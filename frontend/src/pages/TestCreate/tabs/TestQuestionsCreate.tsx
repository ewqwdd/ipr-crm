import { useAppDispatch, useAppSelector } from '@/app';
import { QuestionType } from '@/entities/test';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import TestQuestions from '@/entities/test/ui/TesCreate/TestQuestions/TestQuestions';
import React, { useCallback } from 'react';

export default function TestQuestionsCreate() {
  const dispatch = useAppDispatch();
  const onClear = useCallback(
    (index: number) => dispatch(testCreateActions.clearCorrectOptions(index)),
    [dispatch],
  );
  const questions = useAppSelector((state) => state.testCreate.questions);

  const handleAddOption = useCallback(
    (index: number) => {
      dispatch(testCreateActions.addOption({ index }));
    },
    [dispatch],
  );

  const onCorrectChange = useCallback(
    (questionIndex: number, index: number, value: boolean) => {
      dispatch(
        testCreateActions.setOptionIsCorrect({
          optionIndex: index,
          index: questionIndex,
          value,
        }),
      );
    },
    [dispatch],
  );

  const onDeleteOption = useCallback(
    (questionIndex: number, index: number) => {
      dispatch(
        testCreateActions.deleteOption({
          index: questionIndex,
          optionIndex: index,
        }),
      );
    },
    [dispatch],
  );

  const onNameOptionChange = useCallback(
    (
      questionIndex: number,
      index: number,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      dispatch(
        testCreateActions.setOptionName({
          index: questionIndex,
          optionIndex: index,
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  const onChangeType = useCallback(
    (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'type',
          value: e.target.value as QuestionType,
        }),
      );
    },
    [dispatch],
  );

  const onChangeName = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'label',
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  const onChangeRequired = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'required',
          value: value,
        }),
      );
    },
    [dispatch],
  );

  const onMaxLengthChange = useCallback(
    (index: number, maxLength: string | undefined) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'maxLength',
          value: maxLength,
        }),
      );
    },
    [dispatch],
  );

  const onTextCorrectChange = useCallback(
    (index: number, value: string) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'textCorrectValue',
          value: value,
        }),
      );
    },
    [dispatch],
  );

  const onNumberCorrectChange = useCallback(
    (index: number, value: string) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'numberCorrectValue',
          value: value,
        }),
      );
    },
    [dispatch],
  );

  const onAllowDecimalChange = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'allowDecimal',
          value: value,
        }),
      );
    },
    [dispatch],
  );

  const onMaxNumberChange = useCallback(
    (index: number, value: string | undefined) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'maxNumber',
          value,
        }),
      );
    },
    [dispatch],
  );

  const onMinNumberChange = useCallback(
    (index: number, value: string | undefined) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'minNumber',
          value,
        }),
      );
    },
    [dispatch],
  );

  const deleteQuestion = useCallback(
    (index: number) => {
      dispatch(testCreateActions.deleteQuestion({ index }));
    },
    [dispatch],
  );

  const setCorrectRequired = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'correctRequired',
          value,
        }),
      );
    },
    [dispatch],
  );

  const setMaxMinToggle = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        testCreateActions.setQuestionField({
          index,
          field: 'maxMinToggle',
          value,
        }),
      );
    },
    [dispatch],
  );

  const setOptionScore = useCallback(
    (questionIndex: number, optionIndex: number, value: number | undefined) => {
      dispatch(
        testCreateActions.setOptionScore({
          questionIndex,
          optionIndex,
          value,
        }),
      );
    },
    [dispatch],
  );

  const setQuestionScore = useCallback(
    (questionIndex: number, value: number | undefined) => {
      dispatch(
        testCreateActions.setQuestionField({
          index: questionIndex,
          field: 'score',
          value,
        }),
      );
    },
    [dispatch],
  );

  const props = {
    clearCorrectOptions: onClear,
    questions: questions,
    handleAddOption: handleAddOption,
    onCorrectChange: onCorrectChange,
    onDeleteOption: onDeleteOption,
    onNameOptionChange: onNameOptionChange,
    onChangeType: onChangeType,
    onChangeName: onChangeName,
    onChangeRequired: onChangeRequired,
    onMaxLengthChange: onMaxLengthChange,
    onTextCorrectChange: onTextCorrectChange,
    onNumberCorrectChange: onNumberCorrectChange,
    onAllowDecimalChange: onAllowDecimalChange,
    onMaxNumberChange: onMaxNumberChange,
    onMinNumberChange: onMinNumberChange,
    deleteQuestion: deleteQuestion,
    setCorrectRequired: setCorrectRequired,
    setMaxMinToggle: setMaxMinToggle,
    setOptionScore: setOptionScore,
    setQuestionScore: setQuestionScore,
  };

  return <TestQuestions {...props} />;
}
