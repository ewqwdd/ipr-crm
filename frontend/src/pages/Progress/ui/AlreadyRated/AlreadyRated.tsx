import { Rate } from '@/entities/rates';
import { formatDate } from '@/shared/lib/formatDate';
import { Badge } from '@/shared/ui/Badge';
import Tooltip from '@/shared/ui/Tooltip';

interface AlreadyRatedProps {
  rate: Rate;
}

export default function AlreadyRated({ rate }: AlreadyRatedProps) {
  return (
    <Tooltip
      content={[
        !!rate.startDate && formatDate(rate.startDate),
        rate.endDate && formatDate(rate.endDate),
      ]
        .filter(Boolean)
        .join(' - ')}
    >
      <Badge color="yellow">Оценен</Badge>
    </Tooltip>
  );
}
