import { Modal } from '@/shared/ui/Modal';
import { CompetencyBlock } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { skillsApi } from '@/shared/api/skillsApi';

type AddCompetencyModalData = {
  competencyBlock: Pick<CompetencyBlock, 'id' | 'name'>;
};
interface AddCompetencyModalProps {
  isOpen: boolean;
  modalData: AddCompetencyModalData;
  closeModal: () => void;
}

export default function AddCompetencyModal({
  isOpen,
  modalData: { competencyBlock },
  closeModal,
}: AddCompetencyModalProps) {
  const [value, setValue] = useState('');

  const [createCompetency, comppetencyProps] =
    skillsApi.useCreateCompetencyMutation();

  const competencySubmit = (name: string) => {
    if (!competencyBlock) {
      return toast.error('Не выбран блок компетенций');
    }
    createCompetency({ name, blockId: competencyBlock.id });
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
          Блок компетенций:{' '}
          <span className="text-gray-900 ml-1">{competencyBlock?.name}</span>
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
