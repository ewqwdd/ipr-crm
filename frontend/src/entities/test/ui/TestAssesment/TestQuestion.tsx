import { useAppDispatch, useAppSelector } from '@/app';
import { AssignedTest } from '@/entities/test';
import { Card } from '@/shared/ui/Card';
import FirstScreen from './FirstScreen/FirstScreen';
import QuestionScreen from './QuestionScreen/QuestionScreen';
import { CountdownTimer } from '@/shared/ui/CountdownTimer';
import { useEffect, useState } from 'react';
import { $api } from '@/shared/lib/$api';
import { testsApi } from '@/shared/api/testsApi';

interface TestQuestionProps {
  test: AssignedTest;
  onFinish?: () => void;
}

export default function TestQuestion({ test, onFinish }: TestQuestionProps) {
  const screen = useAppSelector((state) => state.testAssesment.screen);
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<string>(test.startDate);

  useEffect(() => {
    if (test && !test.startDate && screen !== -1) {
      $api.post(`/test/assigned/${test.id}/start`);
      dispatch(
        testsApi.util.updateQueryData('getAssignedTest', test.id, (draft) => {
          draft.startDate = new Date().toISOString();
        }),
      );
      setStartDate(new Date().toISOString());
    }
  }, [test, dispatch, screen]);

  return (
    <>
      <Card className="mt-10 max-w-xl self-center w-full [&>div]:min-h-80 [&>div]:flex [&>div]:flex-col">
        {screen === -1 ? (
          <FirstScreen test={test.test} />
        ) : (
          <QuestionScreen
            testId={test.id}
            onFinish={onFinish}
            test={test.test}
            screen={screen}
          />
        )}
      </Card>
      <div className="mt-4 self-center">
        {test.test.limitedByTime &&
          test.test.timeLimit &&
          (screen !== -1 && startDate ? (
            <CountdownTimer
              onFinish={onFinish}
              startDate={startDate}
              duration={test.test.timeLimit * 60}
            />
          ) : (
            <div>{test.test.timeLimit}:00</div>
          ))}
      </div>
    </>
  );
}
