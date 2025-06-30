import { useModal } from '@/app/hooks/useModal';
import { Ipr } from '../../../model/types';
import { useAppSelector } from '@/app';
import { SoftButton } from '@/shared/ui/SoftButton';
import RemoveDeputy from './RemoveDeputy';

interface AdminSetDeputyProps {
  ipr?: Ipr;
}

export default function AdminSetDeputy({ ipr }: AdminSetDeputyProps) {
  const { openModal } = useModal();
  const userId = useAppSelector((state) => state.user.user?.id);
  const deputies = ipr?.user?.deputyRelationsAsDeputy;

  if (!ipr || !userId || ipr?.user.id === userId) {
    return null;
  }

  return (
    <>
      <SoftButton
        className="self-center"
        size="xs"
        onClick={() =>
          openModal('SET_DEPUTY', {
            deputyId: ipr?.userId,
            userId,
            planId: ipr?.id,
          })
        }
      >
        Назначить заместителем
      </SoftButton>
      <div className="flex gap-1 items-center flex-wrap self-center">
        <span className="text-gray-700 text-sm mr-1">Заместитель:</span>
        {deputies?.map((deputy) => (
          <RemoveDeputy
            ipr={ipr}
            deputyId={ipr.user.id}
            userId={deputy.user.id}
            username={deputy.user.username}
            key={deputy.user.id}
          />
        ))}
      </div>
    </>
  );
}
