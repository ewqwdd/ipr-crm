import { EvaluateUser } from '@/entities/rates/types/types';
import { TeamUser } from '@/entities/team';
import { Checkbox } from '@/shared/ui/Checkbox';
import { StarIcon } from '@heroicons/react/solid';

interface EvaluatorProps {
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  user: TeamUser;
  curator?: boolean;
}

export default function Evaluator({
  selected,
  setSelected,
  user,
  curator,
}: EvaluatorProps) {
  return (
    <Checkbox
      className="py-2 px-6"
      checked={!!selected?.find((e) => e.userId === user.id)}
      title={
        <span className="flex items-center">
          {user.username}
          {curator && <StarIcon className="size-5 text-yellow-400 ml-1" />}
        </span>
      }
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
