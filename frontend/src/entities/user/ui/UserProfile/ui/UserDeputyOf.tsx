import { useModal } from '@/app/hooks/useModal';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { XIcon } from '@heroicons/react/outline';

interface UserDeputyOfProps {
  user: {
    id: number;
    username: string;
  };
  deputyId: number;
  canEdit?: boolean;
}

export default function UserDeputyOf({
  user,
  deputyId,
  canEdit,
}: UserDeputyOfProps) {
  const [removeDeputy, removeDeputyState] = usersApi.useRemoveDeputyMutation();
  const { openModal } = useModal();

  const onDelete = () => {
    openModal('CONFIRM', {
      submitText: 'Удалить',
      title: 'Удалить заместителя?',
      onSubmit: async () => {
        return await removeDeputy({ userId: user.id, deputyId: deputyId });
      },
    });
  };

  return (
    <div
      className={cva('flex', {
        'animate-pulse pointer-events-none': removeDeputyState.isLoading,
      })}
    >
      <SoftButton size="sm" to={`/users/${user.id}`}>
        {user.username}
      </SoftButton>
      {canEdit && (
        <SoftButton className="p-1" danger onClick={onDelete}>
          <XIcon className="size-4" />
        </SoftButton>
      )}
    </div>
  );
}
