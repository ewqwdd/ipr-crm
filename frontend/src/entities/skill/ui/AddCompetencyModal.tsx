import { Modal } from '@/shared/ui/Modal';
import { CompetencyBlock } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { skillsApi } from '@/shared/api/skillsApi';

interface AddCompetencyModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AddCompetencyModal({
  isOpen,
  modalData,
  closeModal,
}: AddCompetencyModalProps) {
  const [value, setValue] = useState('');

  const [createCompetency, comppetencyProps] =
    skillsApi.useCreateCompetencyMutation();

  const { id, name } = modalData as Pick<CompetencyBlock, 'id' | 'name'>;

  const competencySubmit = (name: string) => {
    if (!id) {
      return toast.error('Не выбран блок компетенций');
    }
    createCompetency({ name, blockId: id });
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Новые компетенции"
      onSubmit={() => competencySubmit(value)}
      submitText="Добавить"
      loading={comppetencyProps.isLoading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Блок компетенций: <span className="text-gray-900 ml-1">{name}</span>
        </p>
        <InputWithLabelLight
          placeholder="Название компетенции"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Modal>
  );
}
