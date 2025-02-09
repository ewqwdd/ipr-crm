import { Modal } from '@/shared/ui/Modal';
import useSkillsService from '../hooks/useSkillsService';
import { CompetencyType } from '../types/types';
import { useState } from 'react';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import toast from 'react-hot-toast';

interface EditModalData {
  type: CompetencyType;
  id: number;
  name: string;
}

interface EditModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

export default function EditSkillsModal({
  isOpen,
  closeModal,
  modalData,
}: EditModalProps) {
  const { competency, competencyBlock, indicator } = useSkillsService();
  const { id, name, type } = modalData as EditModalData;
  const [value, setValue] = useState(name);

  const editCompetency = competency.edit[0];
  const editCompetencyBlock = competencyBlock.edit[0];
  const editIndicator = indicator.edit[0];

  const loading =
    competency.edit[1].isLoading ||
    competencyBlock.edit[1].isLoading ||
    indicator.edit[1].isLoading;

  const onSubmit = () => {
    if (value.length === 0) return toast.error('Поле не может быть пустым');
    switch (type) {
      case CompetencyType.COMPETENCY:
        editCompetency({ id, name: value });
        break;
      case CompetencyType.COMPETENCY_BLOCK:
        editCompetencyBlock({ id, name: value });
        break;
      case CompetencyType.INDICATOR:
        editIndicator({ id, name: value });
        break;
    }
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить блок компетенций"
      onSubmit={onSubmit}
      submitText="Добавить"
      loading={loading}
    >
      <InputWithLabelLight
        label="Название"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Modal>
  );
}
