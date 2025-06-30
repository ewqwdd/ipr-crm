import { useModal } from '@/app/hooks/useModal';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { XIcon } from '@heroicons/react/outline';

interface UserDeputyProps {
  deputy: {
    id: number;
    username: string;
  };
  canEdit?: boolean;
  userId: number;
}

export default function UserDeputy({
  deputy,
  canEdit,
  userId,
}: UserDeputyProps) {
  const [removeDeputy, removeDeputyState] = usersApi.useRemoveDeputyMutation();
  const { openModal } = useModal();

  const onDelete = () => {
    openModal('CONFIRM', {
      submitText: 'Удалить',
      title: 'Удалить заместителя?',
      onSubmit: async () => {
        return await removeDeputy({ userId, deputyId: deputy.id });
      },
    });
  };

  return (
    <div
      className={cva('flex', {
        'animate-pulse pointer-events-none': removeDeputyState.isLoading,
      })}
    >
      <SoftButton size="sm" to={`/users/${deputy.id}`}>
        {deputy.username}
      </SoftButton>
      {canEdit && (
        <SoftButton className="w-[38px] p-0" danger onClick={onDelete}>
          <XIcon className="size-4" />
        </SoftButton>
      )}
    </div>
  );
}
