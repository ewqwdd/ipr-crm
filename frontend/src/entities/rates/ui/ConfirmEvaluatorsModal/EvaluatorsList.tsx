import { cva } from '@/shared/lib/cva';
import { Badge } from '@/shared/ui/Badge';
import { XIcon } from '@heroicons/react/outline';
import { EvaluateUser, EvaulatorType } from '../../types/types';

interface EvaluatorsListProps {
  evaluators: EvaluateUser[];
  edittable?: boolean;
  onClick: (userId: number, type: EvaulatorType) => void;
  type: EvaulatorType;
}

export default function EvaluatorsList({
  evaluators,
  edittable = true,
  onClick,
  type,
}: EvaluatorsListProps) {
  return (
    <div
      className={cva('flex gap-2 flex-wrap items-start', {
        'pointer-events-none opacity-80': !edittable,
      })}
    >
      {evaluators.map((evaluator) => (
        <Badge
          key={evaluator.userId}
          className="flex items-center gap-1"
          color="pink"
        >
          {evaluator.username}
          {edittable && (
            <button
              className="hover:opacity-70 transition-all"
              onClick={() => onClick(evaluator.userId, type)}
            >
              <XIcon className="size-4" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}
