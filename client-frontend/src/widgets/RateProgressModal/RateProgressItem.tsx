import { userAtom } from "@/atoms/userAtom";
import type { CompetencyBlock, Rate } from "@/shared/types/Rate";
import SoftButton from "@/shared/ui/SoftButton";
import { useAtomValue } from "jotai";

interface RateProgressItemProps {
  block: CompetencyBlock;
  userRates: Rate["userRates"];
  openAssesment: () => void;
}

export default function RateProgressItem({
  block,
  userRates,
  openAssesment,
}: RateProgressItemProps) {
  const user = useAtomValue(userAtom);
  const indicators = block.competencies.flatMap((c) => c.indicators);
  const filteredRates = userRates.filter(
    (r) =>
      r.userId === user?.id && indicators.some((i) => i.id === r.indicatorId),
  );

  const percent = filteredRates.length / indicators.length;

  return (
    <div className="flex flex-col gap-2 font-extrabold">
      <h3 className="text-secondary text-sm">{block.name}</h3>
      <SoftButton onClick={openAssesment} className="self-start">
        {filteredRates.length === 0
          ? "Начать оценку"
          : `Продолжить оценку (${(percent * 100).toFixed(0)}%)`}
      </SoftButton>
    </div>
  );
}
