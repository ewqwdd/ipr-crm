import { useAppDispatch } from '@/app';
import { surveyAssesmentActions } from '@/entities/survey/surveyAssesmentSlice';
import SurveyQuestion from '@/entities/survey/ui/assesment/SurveyQuestion';
import { surveyApi } from '@/shared/api/surveyApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

export default function SurveyAssesment() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = surveyApi.useGetAssignedSurveyQuery(
    parseInt(id ?? '-1'),
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [finish, finishState] = surveyApi.useFinishSurveyMutation();

  const onFinish = () => {
    if (data) {
      finish(data.id);
    }
  };

  useEffect(() => {
    if (data?.startDate) {
      dispatch(surveyAssesmentActions.setScreen(0));
    }
  }, [data]);

  useEffect(() => {
    if (data?.answeredQUestions && data.answeredQUestions.length > 0) {
      dispatch(surveyAssesmentActions.initAnswers(data));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      dispatch(surveyAssesmentActions.clear());
    };
  }, []);

  useEffect(() => {
    if (data?.finished || finishState.isSuccess) {
      navigate('/survey-finish/' + data?.id);
    }
  }, [data, finishState.isSuccess]);

  useEffect(() => {
    if (finishState.isError) {
      toast.error('Ошибка при завершении опроса');
    }
  }, [finishState.isError]);

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при загрузке опроса');
    }
  }, [isError]);

  return (
    <LoadingOverlay active={isLoading || finishState.isLoading}>
      <div
        className={cva(
          'sm:px-8 sm:py-10 px-4 py-6 flex flex-col h-full relative',
          {
            'animate-pulse pointer-events-none': false,
          },
        )}
      >
        <div className="flex justify-between items-center">
          <Heading title="Прохождение опроса" />
        </div>
        {data && <SurveyQuestion onFinish={onFinish} survey={data} />}
      </div>
    </LoadingOverlay>
  );
}
