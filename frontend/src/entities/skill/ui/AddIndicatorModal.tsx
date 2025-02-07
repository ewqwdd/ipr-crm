import { Modal } from '@/shared/ui/Modal';
import { Competency } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';

interface AddIndicatorModalProps {
  competency?: Competency;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

export default function AddIndicatorModal({
  competency,
  onSubmit,
  setOpen,
  open,
  loading,
}: AddIndicatorModalProps) {
  const [value, setValue] = useState('');

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Новые индикаторы"
      onSubmit={() => onSubmit(value)}
      submitText="Добавить"
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Компетенция:{' '}
          <span className="text-gray-900 ml-1">{competency?.name}</span>
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
