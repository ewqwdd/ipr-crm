import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';
import { Modal } from '@/shared/ui/Modal';
import { UsersSelect } from '@/shared/ui/UsersSelect';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UserDeputyModalData {
  deputyId?: number;
  userId?: number;
  planId?: number;
}
interface UserDeputyModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function UserDeputyModal({
  closeModal,
  isOpen,
  modalData,
}: UserDeputyModalProps) {
  const initialModalData = (modalData ?? {}) as UserDeputyModalData;
  const { data: users, isLoading: usersLoading } = usersApi.useGetUsersQuery();
  const [setDeputy, setDeputyState] = usersApi.useSetDeputyMutation();
  const invalidateTags = useInvalidateTags();

  const [deputyId, setDeputyId] = useState<number | undefined>(
    initialModalData?.deputyId,
  );
  const [userId, setUserId] = useState<number | undefined>(
    initialModalData?.userId,
  );

  const onSubmit = async () => {
    if (deputyId && userId) {
      await setDeputy({ deputyId, userId }).unwrap();
      if (initialModalData.planId) {
        invalidateTags([{ type: 'Ipr', id: initialModalData.planId }]);
      }
      invalidateTags([{ type: 'UserIpr', id: deputyId }]);

      closeModal();
    } else {
      toast.error('Пожалуйста, выберите заместителя и пользователя.');
    }
  };

  return (
    <Modal
      title="Назначить заместителя"
      open={isOpen}
      setOpen={closeModal}
      loading={usersLoading || setDeputyState.isLoading}
      onSubmit={onSubmit}
      submitText="Назначить"
      cancelText="Отмена"
    >
      <div className="flex flex-col gap-2 mt-4">
        <span className="text-gray-500">
          Выберите заместителя для пользователя
        </span>
        <UsersSelect
          users={users?.users ?? []}
          setValue={setDeputyId}
          value={deputyId}
        />
        <span className="text-gray-500">
          Выберите пользователя, для которого назначается заместитель
        </span>
        <UsersSelect
          users={users?.users ?? []}
          setValue={setUserId}
          value={userId}
        />
      </div>
    </Modal>
  );
}
