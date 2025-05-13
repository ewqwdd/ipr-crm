import { useAppSelector } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { Rate, rateTypeNames } from '@/entities/rates';
import { Spec } from '@/entities/user';
import { rate360Api } from '@/shared/api/rate360Api';
import { Badge } from '@/shared/ui/Badge';
import { SoftButton } from '@/shared/ui/SoftButton';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import LastRate from '../LastRate/LastRate';

interface RateItemProps {
  rate: Rate;
  specs: Spec[];
}

export default function RateItem({ rate, specs }: RateItemProps) {
  const { openModal } = useModal();
  const spec = specs.find((spec) => spec.id === rate.specId);
  const [leaveAssigned, { error }] = rate360Api.useLeaveAssignedMutation();
  const userId = useAppSelector((state) => state.user.user!.id);

  const cancelAssesment = () => {
    openModal('CONFIRM', {
      submitText: 'Потвердить',
      title: 'Не могу оценить',
      onSubmit: async () => {
        return await leaveAssigned({ rateId: rate.id });
      },
    });
  };

  useEffect(() => {
    if (error) {
      // @ts-ignore
      toast.error(error?.data?.message || 'Ошибка при отмене оценки');
    }
  }, [error]);

  const lastRate = rate.user?.rates360?.[0];

  return (
    <div className="flex sm:items-center justify-between p-1.5 sm:p-3 rounded-sm border-t border-gray-300 first:border-transparent max-sm:flex-col gap-y-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 sm:gap-4 text-gray-800 text-sm">
          <Badge color="pink" size="sm" className="self-start">
            {spec?.name}
          </Badge>
          <span className="text-gray-700 font-medium text-lbaseg">
            {rate.user.username}
          </span>
          {lastRate && <LastRate lastRate={lastRate} />}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-gray-800 text-sm">
          <span className="font-semibold">{rateTypeNames[rate.type]}</span>
          <span className="text-xs">{rate.startDate?.slice(0, 10)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:flex gap-3">
        {userId !== rate.userId && (
          <SoftButton danger size="xs" onClick={cancelAssesment}>
            Не могу оценить
          </SoftButton>
        )}
        <SoftButton size="xs" onClick={() => openModal('EVALUATE', { rate })}>
          Пройти опрос
        </SoftButton>
      </div>
    </div>
  );
}
