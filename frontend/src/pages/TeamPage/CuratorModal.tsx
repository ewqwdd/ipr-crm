import { TeamSingle } from '@/entities/team';
import { teamsApi } from '@/shared/api/teamsApi';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { generalService } from '@/shared/lib/generalService';
import { Avatar } from '@/shared/ui/Avatar';
import { Modal } from '@/shared/ui/Modal';
import { Radio } from '@/shared/ui/Radio';
import { useEffect, useState } from 'react';

interface CuratorModalProps {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
  users?: TeamSingle['users'];
  teamId: number;
}

export default function CuratorModal({
  setOpen,
  loading,
  open,
  users,
  teamId,
}: CuratorModalProps) {
  const [value, setValue] = useState<number>();
  const { refetch } = usersApi.useGetUsersQuery({});

  const [mutate, { isSuccess, isLoading: mutateLoading }] =
    teamsApi.useAddCuratorMutation();
  const onSubmit = async () => {
    if (!value) return;
    await mutate({ curatorId: value, id: teamId }).unwrap();
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
    }
  }, [isSuccess, setOpen, refetch]);

  return (
    <Modal
      open={!!open}
      setOpen={setOpen}
      onSubmit={onSubmit}
      loading={loading || mutateLoading}
      title="Назначить лидера"
    >
      <div className="flex flex-col space-y-4 mt-6">
        {users?.map((user) => (
          <Radio
            children={
              <div className="flex items-center gap-2">
                <Avatar
                  src={generalService.transformFileUrl(user?.user?.avatar)}
                />
                {user.user?.username}
              </div>
            }
            value={user.userId}
            name="curator"
            onChange={(e) => {
              setValue(Number(e.target.value));
            }}
            key={user.userId}
            checked={value === user.userId}
          />
        ))}
      </div>
    </Modal>
  );
}
