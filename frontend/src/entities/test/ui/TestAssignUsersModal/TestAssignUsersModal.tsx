import { useAppSelector } from '@/app';
import { useFilterUsersByCurator } from '@/shared/hooks/useFilterUsersByCurator';
import { Modal } from '@/shared/ui/Modal';
import { useEffect, useState } from 'react';
import TestAssignedForm from './TestAssignedForm';
import { testsApi } from '@/shared/api/testsApi';
import toast from 'react-hot-toast';

interface TestAssignUsersModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function TestAssignUsersModal({
  closeModal,
  isOpen,
  modalData,
}: TestAssignUsersModalProps) {
  const { testId } = modalData as { testId?: number };
  const teamCurator = useAppSelector((state) => state.user?.user?.teamCurator);
  const role = useAppSelector((state) => state.user?.user?.role.name);
  const [mutate, mutateState] = testsApi.useAssignUsersMutation();

  const { data, isFetching } = useFilterUsersByCurator(teamCurator, role);
  const [selected, setSelected] = useState<number[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  const handleAssignUsers = () => {
    if (!testId) return;
    if (!selected.length) return toast.error('Выберите пользователей');
    mutate({ testId, userIds: selected, startDate: date });
  };

  useEffect(() => {
    if (mutateState.isSuccess) {
      toast.success('Пользователи успешно назначены');
      closeModal();
    }
  }, [mutateState.isSuccess]);

  useEffect(() => {
    if (mutateState.isError) {
      toast.error('Ошибка назначения пользователей');
    }
  }, [mutateState.isError]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      loading={isFetching || mutateState.isLoading}
      title="Назначить тест"
      onSubmit={handleAssignUsers}
    >
      <TestAssignedForm
        role={role}
        date={date}
        setDate={setDate}
        selected={selected}
        setSelected={setSelected}
        users={data ?? []}
      />
    </Modal>
  );
}
