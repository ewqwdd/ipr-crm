import { Modal } from '@/shared/ui/Modal';
import { useState } from 'react';

type ConfirmModalData = {
  onSubmit: () => Promise<void>;
  title?: string;
  submitText?: string;
  children?: React.ReactNode;
};
interface ConfirmModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function ConfirmModal({
  isOpen,
  modalData,
  closeModal,
}: ConfirmModalProps) {
  const { onSubmit, title, submitText, children } =
    modalData as ConfirmModalData;
  const [isLoading, setIsLoading] = useState(false);

  const sumbitWithLoading = async () => {
    setIsLoading(true);
    await onSubmit();
    setIsLoading(false);
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={title || 'Вы уверены?'}
      onSubmit={sumbitWithLoading}
      submitText={submitText}
      loading={isLoading}
      children={children}
    />
  );
}
