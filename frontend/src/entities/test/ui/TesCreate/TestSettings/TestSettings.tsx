import {
  PassedMessage,
  ShowScoreToUser,
  ShuffleQuestions,
  TaskDescription,
  TaskName,
} from '@/widgets/TestSettings';

interface TestSettingsProps {
  name?: string;
  description?: string;
  passedMessage?: string;
  showScoreToUser?: boolean;
  shuffleQuestions?: boolean;
  errors: {
    name?: string;
    description?: string;
    passedMessage?: string;
  };
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeShowScore: () => void;
  onChangePassedMessage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeShuffleQuestions: () => void;
}

export default function TestSettings({
  description,
  errors,
  name,
  onChangeDescription,
  onChangeName,
  onChangePassedMessage,
  onChangeShowScore,
  onChangeShuffleQuestions,
  passedMessage,
  showScoreToUser,
  shuffleQuestions,
}: TestSettingsProps) {
  return (
    <div className="flex flex-col gap-8 mt-6 max-w-2xl">
      <TaskName name={name} error={errors?.name} onChange={onChangeName} />
      <TaskDescription
        description={description}
        error={errors?.description}
        onChange={onChangeDescription}
      />
      <ShowScoreToUser
        showScoreToUser={!!showScoreToUser}
        onChange={onChangeShowScore}
      />
      <PassedMessage
        onChange={onChangePassedMessage}
        passedMessage={passedMessage}
        error={errors?.passedMessage}
      />
      <ShuffleQuestions
        onChange={onChangeShuffleQuestions}
        shuffleQuestions={!!shuffleQuestions}
      />
    </div>
  );
}
