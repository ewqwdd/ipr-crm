import { Rate } from '@/entities/rates';
import { dateService } from '@/shared/lib/dateService';
import { Badge } from '@/shared/ui/Badge';
import Tooltip from '@/shared/ui/Tooltip';

interface AlreadyRatedProps {
  rate: Rate;
}

export default function AlreadyRated({ rate }: AlreadyRatedProps) {
  return (
    <Tooltip
      content={[
        !!rate.startDate && dateService.formatDate(rate.startDate),
        rate.endDate && dateService.formatDate(rate.endDate),
      ]
        .filter(Boolean)
        .join(' - ')}
    >
      <Badge color="yellow">Оценен</Badge>
    </Tooltip>
  );
}
