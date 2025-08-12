import { CaseForm } from '@/entities/cases';
import { caseApi } from '@/shared/api/caseApi';
import { Modal } from '@/shared/ui/Modal';
import { useEffect } from 'react';

interface CaseCreateModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function CaseCreateModal({
  isOpen,
  closeModal,
}: CaseCreateModalProps) {
  const [mutate, { isLoading, isSuccess }] = caseApi.useCreateCaseMutation();

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess]);

  return (
    <Modal
      loading={isLoading}
      open={isOpen}
      setOpen={closeModal}
      title="Создание кейса"
      footer={false}
    >
      <CaseForm onSubmit={mutate} />
    </Modal>
  );
}
