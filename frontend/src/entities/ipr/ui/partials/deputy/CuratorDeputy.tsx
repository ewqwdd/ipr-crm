import { useAppSelector } from '@/app';
import { Ipr } from '@/entities/ipr/model/types';
import RemoveDeputy from './RemoveDeputy';
import { SoftButton } from '@/shared/ui/SoftButton';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { cva } from '@/shared/lib/cva';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';
import { useEffect } from 'react';

interface IprHeadingCuratorDeputyProps {
  ipr?: Ipr;
}

export default function CuratorDeputy({ ipr }: IprHeadingCuratorDeputyProps) {
  const userId = useAppSelector((state) => state.user.user?.id);
  const isDeputy = ipr?.user?.deputyRelationsAsDeputy.some(
    (deputy) => deputy.user.id === userId,
  );
  const [setDeputy, { isLoading, isSuccess }] = usersApi.useSetDeputyMutation();

  const invalidateTags = useInvalidateTags();

  useEffect(() => {
    if (isSuccess) {
      invalidateTags([
        { type: 'Ipr', id: ipr?.id },
        { type: 'UserIpr', id: ipr?.user.id },
      ]);
    }
  }, [isSuccess, invalidateTags, ipr?.user.id, ipr?.id]);

  if (!ipr || !userId || ipr?.user.id === userId) {
    return null;
  }

  return isDeputy ? (
    <RemoveDeputy ipr={ipr} deputyId={ipr.userId} userId={userId} />
  ) : (
    <SoftButton
      className={cva('self-center', {
        'animate-pulse pointer-events-none': isLoading,
      })}
      size="xs"
      onClick={() => setDeputy({ deputyId: ipr?.userId, userId })}
      disabled={isLoading}
    >
      Назначить заместителем
    </SoftButton>
  );
}
