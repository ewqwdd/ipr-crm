import { Card } from '@/shared/ui/Card';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  NumberOptions,
  QuestionError,
  QuestionName,
  RequiredCheckbox,
  TextOptions,
} from '@/widgets/QuestionPartials';
import TestOptions from '@/widgets/QuestionPartials/options/TestOptions';
import { TrashIcon } from '@heroicons/react/outline';
import { CreateSurveyQuestion, SurveyQuestionType } from '../types/types';
import SurveyQuestionTypeSelect from './SurveyQuestionTypeSelect';
import { useAppDispatch } from '@/app';
import { useCallback } from 'react';
import { surveyCreateActions } from '../surveyCreateSlice';
import ScaleOptions from '@/widgets/QuestionPartials/ScaleOptions';
import SurveyQuestionPictureUpload from './edit/ui/SurveyQuestionPictureUpload';

interface SurveyQuestionCreateProps {
  index: number;
  questions: CreateSurveyQuestion[];
}

export default function SurveyQuestionCreate({
  index,
  questions,
}: SurveyQuestionCreateProps) {
  const dispatch = useAppDispatch();

  const onChangeType = useCallback(
    (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'type',
          value: e.target.value as SurveyQuestionType,
        }),
      );
    },
    [dispatch],
  );

  const onChangeName = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'label',
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  const deleteQuestion = useCallback(
    (index: number) => {
      dispatch(surveyCreateActions.deleteQuestion({ index }));
    },
    [dispatch],
  );

  const onChangeRequired = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'required',
          value: value,
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
        surveyCreateActions.setOptionName({
          index: questionIndex,
          optionIndex: index,
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  const onDeleteOption = useCallback(
    (questionIndex: number, index: number) => {
      dispatch(
        surveyCreateActions.deleteOption({
          index: questionIndex,
          optionIndex: index,
        }),
      );
    },
    [dispatch],
  );

  const handleAddOption = useCallback(
    (index: number) => {
      dispatch(
        surveyCreateActions.addOption({
          index,
        }),
      );
    },
    [dispatch],
  );

  const onMaxLengthChange = useCallback(
    (index: number, maxLength: string | undefined) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'maxLength',
          value: maxLength,
        }),
      );
    },
    [dispatch],
  );

  const onAllowDecimalChange = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        surveyCreateActions.setQuestionField({
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
        surveyCreateActions.setQuestionField({
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
        surveyCreateActions.setQuestionField({
          index,
          field: 'minNumber',
          value,
        }),
      );
    },
    [dispatch],
  );

  const setMaxMinToggle = useCallback(
    (index: number, value: boolean) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'maxMinToggle',
          value,
        }),
      );
    },
    [dispatch],
  );

  const onScaleDotsChange = useCallback(
    (index: number, value: number) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'scaleDots',
          value,
        }),
      );
    },
    [dispatch],
  );

  const onScaleStartChange = useCallback(
    (index: number, value: string) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'scaleStart',
          value,
        }),
      );
    },
    [dispatch],
  );

  const onScaleEndChange = useCallback(
    (index: number, value: string) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'scaleEnd',
          value,
        }),
      );
    },
    [dispatch],
  );

  const onPhotoUrlChange = useCallback(
    (index: number, url: string) => {
      dispatch(
        surveyCreateActions.setQuestionField({
          index,
          field: 'photoUrl',
          value: url,
        }),
      );
    },
    [dispatch],
  );

  return (
    <Card className="[&>div]:flex [&>div]:flex-col [&>div]:gap-4">
      <SurveyQuestionPictureUpload
        index={index}
        questions={questions}
        onChange={onPhotoUrlChange}
      />
      <div className="flex gap-4 items-center">
        <SurveyQuestionTypeSelect
          questions={questions}
          index={index}
          onChange={onChangeType}
        />
        <SoftButton
          danger
          onClick={() => deleteQuestion(index)}
          className="p-2"
        >
          <TrashIcon className="w-5 h-5" />
        </SoftButton>
      </div>
      <QuestionName
        onChange={onChangeName}
        questions={questions}
        index={index}
      />
      <div className="flex gap-4 items-center">
        <RequiredCheckbox
          onChange={onChangeRequired}
          questions={questions}
          index={index}
        />
      </div>
      <TestOptions
        onNameOptionChange={onNameOptionChange}
        onDeleteOption={onDeleteOption}
        handleAddOption={handleAddOption}
        questions={questions}
        correctRequired={false}
        index={index}
      />
      <TextOptions
        questions={questions}
        onMaxLengthChange={onMaxLengthChange}
        correctRequired={false}
        index={index}
        setMaxMinToggle={setMaxMinToggle}
      />
      <NumberOptions
        setMaxMinToggle={setMaxMinToggle}
        onMaxNumberChange={onMaxNumberChange}
        onMinNumberChange={onMinNumberChange}
        questions={questions}
        onAllowDecimalChange={onAllowDecimalChange}
        correctRequired={false}
        index={index}
      />
      <ScaleOptions
        index={index}
        questions={questions}
        onScaleDotsChange={onScaleDotsChange}
        onScaleEndChange={onScaleEndChange}
        onScaleStartChange={onScaleStartChange}
      />
      <QuestionError questions={questions} index={index} />
    </Card>
  );
}
