import { useAppSelector } from '@/app';
import { Rate } from '@/entities/rates';
import { dateService } from '@/shared/lib/dateService';
import { Badge } from '@/shared/ui/Badge';
import Tooltip from '@/shared/ui/Tooltip';

interface AlreadyRatedProps {
  rate: Rate;
}

export default function AlreadyRated({ rate }: AlreadyRatedProps) {
  const userId = useAppSelector((state) => state.user.user?.id);
  const lastRate = [...rate.userRates]
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    ?.find((r) => r.userId === userId);

  if (!lastRate) return null;

  return (
    <Tooltip content={dateService.formatDate(lastRate.createdAt)}>
      <Badge color="yellow">Оценен</Badge>
    </Tooltip>
  );
}
