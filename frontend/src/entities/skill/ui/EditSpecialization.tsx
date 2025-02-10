import { Modal } from '@/shared/ui/Modal';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useEffect, useState } from 'react';
import { universalApi } from '@/shared/api/universalApi';
import { TextArea } from '@/shared/ui/TextArea';

interface EditSpecializationModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function EditSpecialization({
  isOpen,
  modalData,
  closeModal,
}: EditSpecializationModalProps) {
  const { id, name, description } = modalData as {
    id: number;
    name: string;
    description?: string;
  };

  const [mutate, { isLoading, isSuccess }] = universalApi.useEditSpecMutation();

  const [newName, setNewName] = useState<string>(name);
  const [newDescription, setNewDescription] = useState<string>(
    description || '',
  );

  //   const [createCompetencyBlock, blockProps] =
  //     skillsApi.useCreateCompetencyBlockMutation();
  // universalApi.

  const blockSubmit = () => {
    mutate({ id, name: newName });
  };

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, closeModal]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Редактировать специализацию"
      onSubmit={blockSubmit}
      submitText="Добавить"
      loading={isLoading}
    >
      <div className="flex flex-col gap-4">
        <InputWithLabelLight
          label="Название"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <TextArea
          placeholder="Описание"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </div>
    </Modal>
  );
}
