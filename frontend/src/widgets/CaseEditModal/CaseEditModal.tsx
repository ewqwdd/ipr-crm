import { Case, CaseForm } from '@/entities/cases';
import { caseApi } from '@/shared/api/caseApi';
import { Modal } from '@/shared/ui/Modal';
import { useEffect } from 'react';

interface CaseCreateModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

type ModalData = { data: Case };

export default function CaseEditModal({
  isOpen,
  closeModal,
  modalData,
}: CaseCreateModalProps) {
  const { data } = modalData as ModalData;
  const [mutate, { isLoading, isSuccess }] = caseApi.useEditCaseMutation();

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
      <CaseForm
        onSubmit={(caseData) => mutate({ id: data.id, data: caseData })}
        initialCase={data}
      />
    </Modal>
  );
}
