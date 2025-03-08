import { Modal } from '@/shared/ui/Modal';
import { Competency } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { skillsApi } from '@/shared/api/skillsApi';
import { EditHints } from './EditHints';
import { hintsDescription } from '../config/hints';

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
  const [boundary, setBoundary] = useState<number>(3);
  const [valueError, setValueError] = useState<string | undefined>();

  const [hints, setHints] = useState<string[]>([
    hintsDescription[1],
    hintsDescription[2],
    hintsDescription[3],
    hintsDescription[4],
    hintsDescription[5],
  ]);

  const [createIndicator, indicatorProps] =
    skillsApi.useCreateIndicatorMutation();

  const { id, name } = modalData as Pick<Competency, 'id' | 'name'>;

  const indicatorSubmit = (name: string) => {
    if (!id) {
      return toast.error('Не выбрана компетеннция');
    }
    if (!name) {
      return setValueError('Поле не может быть пустым');
    }
    createIndicator({
      name,
      competencyId: id,
      boundary,
      hints: {
        1: hints[0],
        2: hints[1],
        3: hints[2],
        4: hints[3],
        5: hints[4],
      },
    });
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
          onChange={(e) => {
            setValueError(undefined);
            setValue(e.target.value);
          }}
          error={valueError}
        />
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-gray-900 text-sm">
            <span className="font-medium">Граница оценки: </span>
            <span className="text-indigo-600">{boundary}</span>
          </p>

          <input
            className="w-full"
            type="range"
            min="1"
            max="5"
            value={boundary}
            step={1}
            onChange={(e) => setBoundary(parseInt(e.target.value))}
          />

          <EditHints data={hints} setData={setHints} />
        </div>
      </div>
    </Modal>
  );
}
