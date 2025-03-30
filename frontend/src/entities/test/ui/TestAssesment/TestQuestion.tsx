import { useAppSelector } from '@/app';
import { AssignedTest } from '@/entities/test';
import { Card } from '@/shared/ui/Card';
import FirstScreen from './FirstScreen/FirstScreen';
import QuestionScreen from './QuestionScreen/QuestionScreen';
import { CountdownTimer } from '@/shared/ui/CountdownTimer';

interface TestQuestionProps {
  test: AssignedTest;
  onFinish?: () => void;
}

export default function TestQuestion({ test, onFinish }: TestQuestionProps) {
  const screen = useAppSelector((state) => state.testAssesment.screen);

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
        {test.test.limitedByTime && test.test.timeLimit && (
          <CountdownTimer
            onFinish={onFinish}
            startDate={test.startDate}
            duration={test.test.timeLimit * 60}
          />
        )}
      </div>
    </>
  );
}
