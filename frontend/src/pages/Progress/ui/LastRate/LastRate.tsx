import { Rate } from '@/entities/rates';
import { formatDate } from '@/shared/lib/formatDate';
import { Badge } from '@/shared/ui/Badge';
import Tooltip from '@/shared/ui/Tooltip';

interface LastRateProps {
  lastRate: Pick<Rate, 'startDate' | 'endDate' | 'id'>;
}

export default function LastRate({ lastRate }: LastRateProps) {
  return (
    <Tooltip
      content={[
        !!lastRate.startDate && formatDate(lastRate.startDate),
        lastRate.endDate && formatDate(lastRate.endDate),
      ]
        .filter(Boolean)
        .join(' - ')}
    >
      <Badge color="yellow">Оценен</Badge>
    </Tooltip>
  );
}
