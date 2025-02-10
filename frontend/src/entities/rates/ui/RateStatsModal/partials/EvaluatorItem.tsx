import { Rate } from "@/entities/rates/types/types";
import { Indicator } from "@/entities/skill";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

interface EvaluatorItemProps {
    evaluator: Rate['evaluators'][0];
      indicators: Indicator[];
      rates: Rate['userRates'];
    }

export default function EvaluatorItem({evaluator, indicators, rates}: EvaluatorItemProps) {

    const userRates = rates.filter(rate => rate.userId === evaluator.userId)
    const percent = userRates.length / indicators.length

    const icon = percent < 1 ? <XCircleIcon className="size-5 text-red-500" /> : <CheckCircleIcon className="size-5 text-green-500" />

  return (
    <div
            className="flex gap-2 items-center p-3 text-gray-800"
            key={evaluator.userId}
          >
            {icon}
            {evaluator.user.username}
          </div>
  )
}
