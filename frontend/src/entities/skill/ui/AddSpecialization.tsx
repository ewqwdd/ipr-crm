import { Modal } from '@/shared/ui/Modal';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';
import { universalApi } from '@/shared/api/universalApi';
import { TextArea } from '@/shared/ui/TextArea';

interface AddSpecializationModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AddSpecialization({
  isOpen,
  closeModal,
}: AddSpecializationModalProps) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [mutate, { isLoading: mutateLoading }] =
    universalApi.useCreateSpecMutation();

  const blockSubmit = () => {
    console.log('AddSpecialization submit => ', { name, description });
    mutate(name);
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Новая специализация"
      onSubmit={blockSubmit}
      submitText="Добавить"
      loading={mutateLoading}
    >
      <div className="flex flex-col gap-4 mt-4">
        <InputWithLabelLight
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextArea
          placeholder="Описание"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </Modal>
  );
}
