import { CompetencyBlock } from '@/entities/skill';
import { Link } from 'react-router';
import { Rate } from '../../types/types';
import { cva } from '@/shared/lib/cva';
import { useModal } from '@/app/hooks/useModal';

interface BlockListItemProps {
  block: CompetencyBlock;
  rate: Rate;
  userRates: Rate['userRates'];
}

export default function BlockListItem({
  block,
  rate,
  userRates,
}: BlockListItemProps) {
  const indicators = block.competencies.flatMap(
    (competency) => competency.indicators,
  );
  const userRatesFiltered = userRates.filter(
    (rate) =>
      !!indicators.find((indicator) => indicator.id === rate.indicatorId),
  );
  const ratesPercent = userRatesFiltered.length / indicators.length;
  const { closeModal } = useModal();

  let disabled = false;

  let linkText = 'Оценить';
  if (ratesPercent > 0) {
    linkText = `Продолжить оценку (${(ratesPercent * 100).toFixed(0)}%)`;
  } else if (indicators.length === 0) {
    disabled = true;
    linkText = 'Оценка не требуется';
  }
  const avg =
    userRatesFiltered.reduce((acc, rate) => acc + rate.rate, 0) /
    userRatesFiltered.length;

  return (
    <div
      className="flex border-b border-gray-300 py-2.5 last:border-transparent px-2"
      key={block.id}
    >
      <div className="flex-1 whitespace-nowrap text-ellipsis max-w-64 w-full overflow-clip pr-2">
        {block.name}
      </div>
      <div className="min-w-28 font-medium text-gray-500 pl-4">
        Оценка:{' '}
        <span className="text-gray-800">
          {userRatesFiltered.length > 0 ? avg.toFixed(1) : '-'}
        </span>
      </div>
      <div className="flex-1 flex justify-end">
        <Link
          to={`/progress/${rate.id}?tab=${block.id}`}
          onClick={closeModal}
          className={cva('text-violet-500 font-semibold', {
            'pointer-events-none cursor-not-allowed': disabled,
          })}
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
