import { Modal } from '@/shared/ui/Modal';
import { SkillType } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';

interface AddCompetencyBlockModalProps {
  skillType: SkillType;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

export default function AddCompetencyBlockModal({
  skillType,
  onSubmit,
  setOpen,
  open,
  loading,
}: AddCompetencyBlockModalProps) {
  const [value, setValue] = useState('');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Добавить блок компетенций"
      onSubmit={() => onSubmit(value)}
      submitText="Добавить"
      loading={loading}
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
