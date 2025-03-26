import PassedMessage from './PassedMessage';
import ShowScoreToUser from './ShowScoreToUser';
import TaskDescription from './TaskDescription';
import TaskName from './TaskName';

export default function TestSettings() {
  return (
    <div className="flex flex-col gap-8 mt-6 max-w-2xl">
      <TaskName />
      <TaskDescription />
      <ShowScoreToUser />
      <PassedMessage />
    </div>
  );
}
