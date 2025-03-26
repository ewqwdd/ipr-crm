import { useAppDispatch, useAppSelector } from '@/app';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { testCreateActions } from '../../../testCreateSlice';
import Question from './Question';

export default function TestQuestions() {
  const questions = useAppSelector(
    (state) => state.testCreate.questions.length,
  );
  const error = useAppSelector((state) => state.testCreate.errors.questions);
  const dispatch = useAppDispatch();

  const handleAddQuestion = () => {
    dispatch(testCreateActions.addQuestion());
  };

  return (
    <div className="flex flex-col gap-8 mt-6 max-w-4xl">
      {new Array(questions).fill(0).map((_, index) => (
        <Question key={index} index={index} />
      ))}
      {error && <p className="text-red-500 font-medium">{error}</p>}
      <PrimaryButton onClick={handleAddQuestion} className="self-start">
        Добавить вопрос
      </PrimaryButton>
    </div>
  );
}
