import { Modal } from '@/shared/ui/Modal';
import { SkillType } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';
import { skillsApi } from '@/shared/api/skillsApi';

type AddCompetencyBlockModalData = {
  skillType: SkillType;
};
interface AddCompetencyBlockModalProps {
  isOpen: boolean;
  modalData: AddCompetencyBlockModalData;
  closeModal: () => void;
}

export default function AddCompetencyBlockModal({
  isOpen,
  modalData,
  closeModal,
}: AddCompetencyBlockModalProps) {
  const [value, setValue] = useState('');

  const [createCompetencyBlock, blockProps] =
    skillsApi.useCreateCompetencyBlockMutation();

  const { skillType } = modalData;

  const blockSubmit = (name: string) => {
    createCompetencyBlock({ name, type: skillType });
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить блок компетенций"
      onSubmit={() => blockSubmit(value)}
      submitText="Добавить"
      loading={blockProps.isLoading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Навыки: <span className="text-gray-900 ml-1">{skillType}</span>
        </p>
        <InputWithLabelLight
          placeholder="Название блока"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Modal>
  );
}
