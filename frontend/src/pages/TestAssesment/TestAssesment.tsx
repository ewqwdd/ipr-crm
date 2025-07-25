import { useAppDispatch } from '@/app';
import { TestQuestion } from '@/entities/test';
import { testAssesmentActions } from '@/entities/test/testAssesmentSlice';
import { testsApi } from '@/shared/api/testsApi';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

export default function TestAssesment() {
  const { id } = useParams<{ id: string }>();
  const { data, isFetching: isLoading } = testsApi.useGetAssignedTestQuery(
    parseInt(id ?? '-1'),
  );
  const dispatch = useAppDispatch();
  const [finish, finishState] = testsApi.useFinishTestMutation();
  const navigate = useNavigate();
  const invalidateTags = useInvalidateTags();

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
    if (data?.answeredQUestions && data.answeredQUestions.length > 0) {
      dispatch(testAssesmentActions.initAnswers(data));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      invalidateTags([{ type: 'TestAssigned' }, { type: 'TestAssigned', id }]);
    };
  }, [id, dispatch]);

  return (
    <LoadingOverlay active={isLoading}>
      <div
        className={cva(
          'sm:px-8 sm:py-10 px-4 py-6 flex flex-col h-full relative',
          {
            'animate-pulse pointer-events-none': finishState.isLoading,
          },
        )}
      >
        <div className="flex justify-between items-center">
          <Heading title="Прохождение теста" />
        </div>
        {data && <TestQuestion onFinish={onFinish} test={data} />}
      </div>
    </LoadingOverlay>
  );
}
