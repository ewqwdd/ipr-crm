import { evaluatorTypeNames } from '@/entities/rates/model/evaluatorTypeNames';
import { EvaulatorType, Rate } from '@/entities/rates/types/types';
import { Indicator } from '@/entities/skill';
import { Accordion } from '@/shared/ui/Accordion';
import EvaluatorItem from './EvaluatorItem';

interface EvaluatorsListProps {
  evaluators: Rate['evaluators'];
  type: EvaulatorType;
  indicators: Indicator[];
  rates: Rate['userRates'];
}

export default function EvaluatorsList({
  evaluators,
  type,
  indicators,
  rates,
}: EvaluatorsListProps) {
  const filteredEvaluators = evaluators.filter(
    (evaluator) => evaluator.type === type,
  );

  return (
    <Accordion title={evaluatorTypeNames[type]} defaultOpen>
      <div className="rext-gray-700 text-sm flex flex-col bg-violet-50">
        {filteredEvaluators.map((evaluator) => (
          <EvaluatorItem
            rates={rates}
            indicators={indicators}
            evaluator={evaluator}
            key={evaluator.userId}
          />
        ))}
      </div>
    </Accordion>
  );
}
