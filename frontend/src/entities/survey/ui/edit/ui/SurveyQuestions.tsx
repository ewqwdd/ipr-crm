import { useAppDispatch, useAppSelector } from '@/app';
import { surveyCreateActions, SurveyQuestionCreate } from '@/entities/survey';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { memo } from 'react';

export default memo(function SurveyQuestions() {
  const error = useAppSelector(
    (state) => state.surveyCreate.errors.surveyQuestions,
  );
  const questions = useAppSelector(
    (state) => state.surveyCreate.surveyQuestions,
  );

  const dispatch = useAppDispatch();

  const handleAddQuestion = () => {
    dispatch(surveyCreateActions.addQuestion());
  };

  return (
    <div className="flex flex-col gap-8 mt-6 max-w-4xl">
      {new Array(questions.length).fill(0).map((_, index) => (
        <SurveyQuestionCreate questions={questions} key={index} index={index} />
      ))}
      {error && <p className="text-red-500 font-medium">{error}</p>}
      <PrimaryButton onClick={handleAddQuestion} className="self-start">
        Добавить вопрос
      </PrimaryButton>
    </div>
  );
});
