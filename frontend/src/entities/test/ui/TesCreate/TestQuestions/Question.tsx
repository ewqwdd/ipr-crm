import { Card } from '@/shared/ui/Card';
import QuestionTypeSelect from './QuesyionPartials/QuestionTypeSelect';
import { memo, useEffect } from 'react';
import QuestionName from './QuesyionPartials/QuestionName';
import RequiredCheckbox from './QuesyionPartials/RequiredCheckbox';
import SetCorrectAnswer from './QuesyionPartials/SetCorrectAnswer';
import TestOptions from './QuesyionPartials/options/TestOptions';
import TextOptions from './QuesyionPartials/text/TextOptions';
import NumberOptions from './QuesyionPartials/number/NumberOptions';
import Error from './QuesyionPartials/Error';
import { CreateQuestion } from '@/entities/test/types/types';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TrashIcon } from '@heroicons/react/outline';

interface QuestionProps {
  index: number;
  clearCorrectOptions: (index: number) => void;
  questions: CreateQuestion[];
  handleAddOption: (index: number) => void;
  onCorrectChange: (questionIndex: number, optionIndex: number, value: boolean) => void;
  onDeleteOption: (questionIndex: number, optionIndex: number) => void;
  onNameOptionChange: (
    questionIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onChangeType: (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  onChangeName: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeRequired: (index: number, value: boolean) => void;
  onMaxLengthChange: (index: number, maxLength: string | undefined) => void;
  onTextCorrectChange: (index: number, value: string) => void;
  onNumberCorrectChange: (index: number, value: string) => void;
  onAllowDecimalChange: (index: number, value: boolean) => void;
  onMaxNumberChange: (index: number, value: string | undefined) => void;
  onMinNumberChange: (index: number, value: string | undefined) => void;
  deleteQuestion: (index: number) => void;
  setCorrectRequired: (index: number, value: boolean) => void;
  setMaxMinToggle: (index: number, value: boolean) => void;
}

export default memo(function Question({
  index,
  clearCorrectOptions,
  questions,
  handleAddOption,
  onCorrectChange,
  onDeleteOption,
  onNameOptionChange,
  onAllowDecimalChange,
  onChangeName,
  onChangeRequired,
  onChangeType,
  onMaxLengthChange,
  onMaxNumberChange,
  onMinNumberChange,
  onNumberCorrectChange,
  onTextCorrectChange,
  deleteQuestion,
  setCorrectRequired,
  setMaxMinToggle,
}: QuestionProps) {

  const correctRequired = !!questions[index].correctRequired;

  useEffect(() => {
    if (!correctRequired) {
      clearCorrectOptions(index);
    }
  }, [correctRequired, index, clearCorrectOptions]);

  return (
    <Card className="[&>div]:flex [&>div]:flex-col [&>div]:gap-4">
      <div className="flex gap-4 items-center">
        <QuestionTypeSelect
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
        <SetCorrectAnswer
          index={index}
          correctRequired={correctRequired}
          setCorrectRequired={setCorrectRequired}
        />
      </div>
      <TestOptions
        onNameOptionChange={onNameOptionChange}
        onDeleteOption={onDeleteOption}
        onCorrectChange={onCorrectChange}
        handleAddOption={handleAddOption}
        questions={questions}
        correctRequired={correctRequired}
        index={index}
      />
      <TextOptions
        questions={questions}
        onTextCorrectChange={onTextCorrectChange}
        onMaxLengthChange={onMaxLengthChange}
        correctRequired={correctRequired}
        index={index}
      />
      <NumberOptions
        setMaxMinToggle={setMaxMinToggle}
        onMaxNumberChange={onMaxNumberChange}
        onMinNumberChange={onMinNumberChange}
        questions={questions}
        onAllowDecimalChange={onAllowDecimalChange}
        onNumberCorrectChange={onNumberCorrectChange}
        correctRequired={correctRequired}
        index={index}
      />
      <Error questions={questions} index={index} />
    </Card>
  );
});
