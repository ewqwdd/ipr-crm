import { Modal } from '@/shared/ui/Modal';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';
import { TextArea } from '@/shared/ui/TextArea';
import { universalApi } from '@/shared/api/universalApi';

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

  console.log('description => ', description);

  const [newName, setNewName] = useState<string>(name);
  // const [newDescription, setNewDescription] = useState<string>(
  //   description || '',
  // );

  //   const [createCompetencyBlock, blockProps] =
  //     skillsApi.useCreateCompetencyBlockMutation();
  // universalApi.

  const blockSubmit = () => {
    console.log('EditSpecialization submit => ', {
      id,
      name: newName,
      // description: newDescription,
    });
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить блок компетенций"
      onSubmit={blockSubmit}
      submitText="Добавить"
      //   loading={blockProps.isLoading}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-sm text-gray-500 mt-2">Новая специализация</h2>
        <InputWithLabelLight
          placeholder="Название"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        {/* TODO:  */}
        {/* <TextArea
          placeholder="Описание"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        /> */}
      </div>
    </Modal>
  );
}
