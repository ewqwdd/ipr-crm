import { useAppDispatch, useAppSelector } from '@/app';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { testCreateActions } from '../../../testCreateSlice';
import Question from './Question';
import { CreateQuestion } from '@/entities/test/types/types';

interface TestQuestionsProps {
  clearCorrectOptions: (index: number) => void;
  questions: CreateQuestion[];
  handleAddOption: (index: number) => void;
  onCorrectChange: (
    questionIndex: number,
    optionIndex: number,
    value: boolean,
  ) => void;
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

export default function TestQuestions(props: TestQuestionsProps) {
  const { questions } = props;

  const error = useAppSelector((state) => state.testCreate.errors.questions);
  const dispatch = useAppDispatch();

  const handleAddQuestion = () => {
    dispatch(testCreateActions.addQuestion());
  };

  return (
    <div className="flex flex-col gap-8 mt-6 max-w-4xl">
      {new Array(questions.length).fill(0).map((_, index) => (
        <Question {...props} key={index} index={index} />
      ))}
      {error && <p className="text-red-500 font-medium">{error}</p>}
      <PrimaryButton onClick={handleAddQuestion} className="self-start">
        Добавить вопрос
      </PrimaryButton>
    </div>
  );
}
