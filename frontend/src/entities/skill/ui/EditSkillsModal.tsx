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
  boundary?: number;
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
  const { id, name, type, boundary: boundaryInit } = modalData as EditModalData;
  const [value, setValue] = useState(name);
  const [boundary, setBoundary] = useState<number>(boundaryInit ?? 3);

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
        editIndicator({ id, name: value, boundary });
        break;
    }
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Редактировать блок компетенции"
      onSubmit={onSubmit}
      submitText="Добавить"
      loading={loading}
    >
      <InputWithLabelLight
        label="Название"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="mt-4 flex flex-col gap-2">
        {type === CompetencyType.INDICATOR && (
          <>
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
          </>
        )}
      </div>
    </Modal>
  );
}
