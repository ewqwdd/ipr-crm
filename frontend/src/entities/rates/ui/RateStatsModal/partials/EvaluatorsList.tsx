import { evaluatorTypeNames } from '@/entities/rates/model/evaluatorTypeNames';
import { EvaulatorType, Rate } from '@/entities/rates/types/types';
import { Accordion } from '@/shared/ui/Accordion';
import { XCircleIcon } from '@heroicons/react/outline';

interface EvaluatorsListProps {
  evaluators: Rate['evaluators'];
  type: EvaulatorType;
}

export default function EvaluatorsList({
  evaluators,
  type,
}: EvaluatorsListProps) {
  const filteredEvaluators = evaluators.filter(
    (evaluator) => evaluator.type === type,
  );

  return (
    <Accordion title={evaluatorTypeNames[type]} defaultOpen>
      <div className="rext-gray-700 text-sm flex flex-col bg-violet-50">
        {filteredEvaluators.map((evaluator) => (
          <div
            className="flex gap-2 items-center p-3 text-gray-800"
            key={evaluator.userId}
          >
            <XCircleIcon className="size-5 text-red-500" />
            {evaluator.user.username}
          </div>
        ))}
      </div>
    </Accordion>
  );
}
