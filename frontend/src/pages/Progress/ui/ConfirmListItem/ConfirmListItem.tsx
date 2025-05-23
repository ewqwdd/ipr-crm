import { useModal } from '@/app/hooks/useModal';
import { Rate, rateTypeNames } from '@/entities/rates';
import { Spec } from '@/entities/user';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { Link } from 'react-router';

interface ConfirmListItemProps {
  rate: Rate;
  specs: Spec[];
  curatorBlocked?: boolean;
  isFetching?: boolean;
  index?: number;
}

export default function ConfirmListItem({
  rate,
  specs,
  curatorBlocked,
  isFetching,
  index = 0,
}: ConfirmListItemProps) {
  const spec = specs.find((spec) => spec.id === rate.specId);
  const { openModal } = useModal();

  if (isFetching) {
    return (
      <div
        className={cva(
          'animate-pulse bg-gray-100 h-14 flex items-center px-6',
          {
            'bg-gray-200': index % 2 === 0,
          },
        )}
      >
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-1.5 sm:p-3  rounded-sm border-t border-gray-300 first:border-transparent flex-wrap gap-y-3 gap-[1%]">
      <Link
        to={`/teams/${rate.teamId}`}
        className="text-base font-medium text-violet-600 flex-nowrap sm:basis-[15%] basis-[32%]"
      >
        {rate?.team?.name}
      </Link>
      <span className="text-base font-medium text-gray-800 flex-nowrap sm:basis-[15%] basis-[32%]">
        {spec?.name}
      </span>
      <div className="sm:basis-[15%] basis-[32%] max-sm:justify-center flex gap-2 items-center">
        <Link
          to={`/users/${rate?.userId}`}
          className="text-base font-medium text-violet-600 flex-nowrap max-sm:text-sm"
        >
          {rate?.user.username}
        </Link>
      </div>
      <span className="sm:text-base text-sm text-gray-500 flex-nowrap sm:basis-[15%] basis-[24%] max-sm:text-right text-nowrap max-[420px]:text-xs">
        {rateTypeNames[rate.type]}
      </span>
      <span className="sm:text-base text-sm text-gray-500 flex-nowrap sm:basis-[15%] basis-[24%] text-nowrap max-[420px]:text-xs">
        {rate.startDate?.slice(0, 10)}
      </span>
      <SoftButton
        size="xs"
        onClick={() =>
          openModal('CONFIRM_EVALUATORS', { rate, curatorBlocked })
        }
        className="sm:basis-[15%]"
      >
        Утвердить список
      </SoftButton>
    </div>
  );
}
