import { EvaluateUser } from '@/entities/rates/types/types';
import { TeamUser } from '@/entities/team';
import { Checkbox } from '@/shared/ui/Checkbox';

interface EvaluatorProps {
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  user: TeamUser;
}

export default function Evaluator({
  selected,
  setSelected,
  user,
}: EvaluatorProps) {
  return (
    <Checkbox
      className="py-2 px-6"
      checked={!!selected?.find((e) => e.userId === user.id)}
      title={user.username}
      onChange={() =>
        setSelected((prev) =>
          prev?.find((e) => e.userId === user.id)
            ? prev.filter((e) => e.userId !== user.id)
            : [...prev, { userId: user.id, username: user.username }],
        )
      }
    />
  );
}
