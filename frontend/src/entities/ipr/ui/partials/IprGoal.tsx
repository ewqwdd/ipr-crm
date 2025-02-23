import { Card } from "@/shared/ui/Card";
import { Ipr } from "../../model/types";

interface IprGoalProps {
    ipr?: Ipr;
}

export default function IprGoal({ ipr }: IprGoalProps) {
  return (
    <Card>
        <h2 className="text-lg font-semibold mb-4">Goal: </h2>
        <p>{ipr?.goal}</p>
    </Card>

)
}
