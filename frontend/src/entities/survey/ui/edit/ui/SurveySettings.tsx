import { useAppDispatch, useAppSelector } from '@/app';
import { surveyCreateActions } from '@/entities/survey';
import {
  PassedMessage,
  TaskDescription,
  TaskName,
} from '@/widgets/TestSettings';
import { memo, useCallback } from 'react';

export default memo(function SurveySettings() {
  const dispatch = useAppDispatch();

  const name = useAppSelector((state) => state.surveyCreate.name);
  const description = useAppSelector((state) => state.surveyCreate.description);
  const passedMessage = useAppSelector(
    (state) => state.surveyCreate.finishMessage,
  );

  const errors = useAppSelector((state) => state.surveyCreate.errors);

  const onChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        surveyCreateActions.setField({ field: 'name', value: e.target.value }),
      );
    },
    [dispatch],
  );

  const onChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(
        surveyCreateActions.setField({
          field: 'description',
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  const onChangePassedMessage = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(
        surveyCreateActions.setField({
          field: 'finishMessage',
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="flex flex-col gap-8 mt-6 max-w-2xl">
      <TaskName
        placeholder="Название опроса"
        name={name}
        error={errors?.name}
        onChange={onChangeName}
      />
      <TaskDescription
        description={description}
        error={errors?.description}
        onChange={onChangeDescription}
      />
      <PassedMessage
        onChange={onChangePassedMessage}
        passedMessage={passedMessage}
        error={errors?.finishMessage}
      />
    </div>
  );
});
