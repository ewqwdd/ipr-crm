import { useModal } from '@/app/hooks/useModal';
import { Rate, rateTypeNames } from '@/entities/rates';
import { Spec } from '@/entities/user';
import { Badge } from '@/shared/ui/Badge';
import { SoftButton } from '@/shared/ui/SoftButton';

interface RateItemProps {
  rate: Rate;
  specs: Spec[];
}

export default function RateItem({ rate, specs }: RateItemProps) {
  const { openModal } = useModal();
  const spec = specs.find((spec) => spec.id === rate.specId);

  return (
    <div className="flex items-center justify-between p-1.5 sm:p-3 rounded-sm border-t border-gray-300 first:border-transparent">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 sm:gap-4 text-gray-800 text-sm">
          <Badge color="pink" size="sm" className="self-start">
            {spec?.name}
          </Badge>
          <span className="text-gray-700 font-medium text-lbaseg">
            {rate.user.username}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-gray-800 text-sm">
          <span className="font-semibold">{rateTypeNames[rate.type]}</span>
          <span className="text-xs">{rate.startDate?.slice(0, 10)}</span>
        </div>
      </div>
      <SoftButton size="xs" onClick={() => openModal('EVALUATE', { rate })}>
        Пройти тест
      </SoftButton>
    </div>
  );
}
