import { Ipr } from '@/entities/ipr/model/types';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';
import { cva } from '@/shared/lib/cva';
import { Badge } from '@/shared/ui/Badge';
import { SoftButton } from '@/shared/ui/SoftButton';
import { XIcon } from '@heroicons/react/outline';
import { useEffect } from 'react';
import { Link } from 'react-router';

interface RemoveDeputyProps {
  userId: number;
  deputyId: number;
  ipr: Ipr;
  username?: string;
}

export default function RemoveDeputy({
  userId,
  deputyId,
  ipr,
  username = 'Ваш заместитель',
}: RemoveDeputyProps) {
  const [removeDeputy, { isLoading, isSuccess }] =
    usersApi.useRemoveDeputyMutation();
  const invalidateTags = useInvalidateTags();

  useEffect(() => {
    if (isSuccess) {
      invalidateTags([
        { type: 'Ipr', id: ipr?.id },
        { type: 'UserIpr', id: deputyId },
      ]);
    }
  }, [isSuccess, invalidateTags, deputyId, ipr?.id]);

  return (
    <div
      className={cva('flex items-center gap-0.5 self-center', {
        'animate-pulse pointer-events-none': isLoading,
      })}
    >
      <Link to={`/users/${deputyId}`}>
        <Badge className="self-center" size="md" color="green">
          {username}
        </Badge>
      </Link>
      <SoftButton className="p-1" danger>
        <XIcon
          className="size-4"
          onClick={() => removeDeputy({ userId, deputyId })}
        />
      </SoftButton>
    </div>
  );
}
