import { Rate } from '@/entities/rates';
import { Progress } from '@/shared/ui/Progress';

interface Rate360ProgressProps {
  rate: Rate;
  percent?: number;
}

const ProgressBar = ({ percent }: { percent: number }) => (
  <>
    {Math.floor(percent * 100)}%
    <Progress percent={percent} className="w-full max-w-14" />
  </>
);

export default function Rate360Progress({
  rate,
  percent: percentInit,
}: Rate360ProgressProps) {
  if (percentInit) return <ProgressBar percent={percentInit} />;

  const evaluatorsCount = rate.evaluators.length ?? 0;
  const ratesCount = rate.userRates.length ?? 0;

  const indicators = rate?.competencyBlocks.flatMap((skill) =>
    skill!.competencies.flatMap((comp) => comp.indicators),
  );

  let percent =
    ratesCount / Math.max((evaluatorsCount + 1) * (indicators?.length ?? 1), 1);

  if (indicators?.length === 0) {
    percent = 1;
  }

  return <ProgressBar percent={percent} />;
}
