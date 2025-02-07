import { Modal } from '@/shared/ui/Modal';
import { CompetencyBlock } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';

interface AddCompetencyModalProps {
  competencyBlock?: CompetencyBlock;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

export default function AddCompetencyModal({
  competencyBlock,
  onSubmit,
  setOpen,
  open,
  loading,
}: AddCompetencyModalProps) {
  const [value, setValue] = useState('');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Новые компетенции"
      onSubmit={() => onSubmit(value)}
      submitText="Добавить"
      loading={loading}
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
