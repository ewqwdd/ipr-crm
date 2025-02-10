import { Rate } from '../../types/types';
import { CompetencyBlock } from '@/entities/skill';
import BlockListItem from './BlockListItem';

interface IndicatorsListProps {
  rate: Rate;
  skills: CompetencyBlock[];
  userRates: Rate['userRates'];
}

export default function IndicatorsList({
  rate,
  skills,
  userRates,
}: IndicatorsListProps) {
  return (
    <div className="flex flex-col">
      {skills.map((block) => (
        <BlockListItem
          block={block}
          rate={rate}
          userRates={userRates}
          key={block.id}
        />
      ))}
    </div>
  );
}
