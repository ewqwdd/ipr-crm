import { useAppDispatch } from '@/app';
import { TestQuestion } from '@/entities/test';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { testsApi } from '@/shared/api/testsApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

export default function TestAssesment() {
  const { id } = useParams<{ id: string }>();
  const {
    data,
    isFetching: isLoading,
    isError,
  } = testsApi.useGetAssignedTestQuery(parseInt(id ?? '-1'));
  const dispatch = useAppDispatch();
  const [finish, finishState] = testsApi.useFinishTestMutation();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(testAssesmentActions.clear());
    };
  }, []);

  useEffect(() => {
    if (data?.startDate) {
      dispatch(testAssesmentActions.setScreen(0));
    }
  }, [data]);

  const onFinish = () => {
    if (data) {
      finish(data.id);
    }
  };

  useEffect(() => {
    if (data?.finished || finishState.isSuccess) {
      navigate('/test-finish/' + data?.id);
    }
  }, [data, finishState.isSuccess]);

  useEffect(() => {
    if (finishState.isError) {
      toast.error('Ошибка при завершении теста');
    }
  }, [finishState.isError]);

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при загрузке теста');
    }
  }, [isError]);


  useEffect(() => {
    if (data?.answeredQUestions && data.answeredQUestions.length > 0) {
      dispatch(testAssesmentActions.initAnswers(data));
    }
  }, [data]);

  return (
    <LoadingOverlay active={isLoading}>
      <div
        className={cva('px-8 py-10 flex flex-col h-full relative', {
          'animate-pulse pointer-events-none': finishState.isLoading,
        })}
      >
        <div className="flex justify-between items-center">
          <Heading title="Прохождение теста" />
        </div>
        {data && <TestQuestion onFinish={onFinish} test={data} />}
      </div>
    </LoadingOverlay>
  );
}
