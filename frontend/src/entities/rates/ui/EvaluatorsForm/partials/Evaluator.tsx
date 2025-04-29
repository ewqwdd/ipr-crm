import { EvaluateUser } from '@/entities/rates/types/types';
import { TeamUser } from '@/entities/team';
import { Checkbox } from '@/shared/ui/Checkbox';
import { StarIcon } from '@heroicons/react/solid';

interface EvaluatorProps {
  selected?: EvaluateUser[];
  onChange: (e: TeamUser) => void;
  user: TeamUser;
  curator?: boolean;
}

export default function Evaluator({
  selected,
  onChange,
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
      onChange={() => onChange(user)}
    />
  );
}
