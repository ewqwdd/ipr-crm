import { useModal } from '@/app/hooks/useModal';
import { Rate, rateTypeNames } from '@/entities/rates';
import { Spec } from '@/entities/user';
import { SoftButton } from '@/shared/ui/SoftButton';

interface ConfirmListItemProps {
  rate: Rate;
  specs: Spec[];
  curatorBlocked?: boolean;
}

export default function ConfirmListItem({
  rate,
  specs,
  curatorBlocked,
}: ConfirmListItemProps) {
  const spec = specs.find((spec) => spec.id === rate.specId);
  const { openModal } = useModal();

  return (
    <div className="flex items-center justify-between p-3  rounded-sm border-t border-gray-300 first:border-transparent">
      <span className="text-base font-medium text-gray-800">{spec?.name}</span>
      <span className="text-base text-gray-500">
        {rateTypeNames[rate.type]}
      </span>
      <span className="text-base text-gray-500">
        {rate.startDate?.slice(0, 10)}
      </span>
      <SoftButton
        size="xs"
        onClick={() =>
          openModal('CONFIRM_EVALUATORS', { rate, curatorBlocked })
        }
      >
        Утвердить список
      </SoftButton>
    </div>
  );
}
