import { AssignedSurvey } from '../../types/types';
import { useAppDispatch, useAppSelector } from '@/app';
import { useEffect } from 'react';
import { Card } from '@/shared/ui/Card';
import FirstScreen from './FirstScreen/FirstScreen';
import QuestionScreen from './QuestionScreen/QuestionScreen';
import { $api } from '@/shared/lib/$api';
import { surveyApi } from '@/shared/api/surveyApi';

interface SurveyQuestionProps {
  survey: AssignedSurvey;
  onFinish?: () => void;
}

export default function SurveyQuestion({
  survey,
  onFinish,
}: SurveyQuestionProps) {
  const screen = useAppSelector((state) => state.surveyAssesment.screen);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (survey && !survey.startDate && screen !== -1) {
      $api.post(`/survey/assigned/${survey.id}/start`);
      dispatch(
        surveyApi.util.updateQueryData(
          'getAssignedSurvey',
          survey.id,
          (draft) => {
            draft.startDate = new Date().toISOString();
          },
        ),
      );
    }
  }, [survey, dispatch, screen]);

  return (
    <Card className="mt-10 max-w-xl self-center w-full [&>div]:min-h-80 [&>div]:flex [&>div]:flex-col">
      {screen === -1 ? (
        <FirstScreen survey={survey.survey} />
      ) : (
        <QuestionScreen
          surveyId={survey.id}
          onFinish={onFinish}
          survey={survey.survey}
          screen={screen}
        />
      )}
    </Card>
  );
}
