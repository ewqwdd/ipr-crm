import { Modal } from '@/shared/ui/Modal';
import { Competency } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { skillsApi } from '@/shared/api/skillsApi';

interface AddIndicatorModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

export default function AddIndicatorModal({
  isOpen,
  modalData,
  closeModal,
}: AddIndicatorModalProps) {
  const [value, setValue] = useState('');

  const [createIndicator, indicatorProps] =
    skillsApi.useCreateIndicatorMutation();

  const { id, name } = modalData as Pick<Competency, 'id' | 'name'>;

  const indicatorSubmit = (name: string) => {
    if (!id) {
      return toast.error('Не выбрана компетеннция');
    }
    createIndicator({ name, competencyId: id });
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Новые индикаторы"
      onSubmit={() => indicatorSubmit(value)}
      submitText="Добавить"
      loading={indicatorProps.isLoading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Компетенция: <span className="text-gray-900 ml-1">{name}</span>
        </p>
        <InputWithLabelLight
          placeholder="Название индикатора"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Modal>
  );
}
