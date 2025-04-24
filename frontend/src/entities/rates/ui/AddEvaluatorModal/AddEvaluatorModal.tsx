import { Modal } from '@/shared/ui/Modal';
import { EvaluateUser, EvaulatorType } from '../../types/types';
import { useAppSelector } from '@/app';
import { useState } from 'react';
import EvaluatorsForm from '../EvaluatorsForm/EvaluatorsForm';

interface AddEvaluatorModalData {
  onSubmit: (data: EvaluateUser[]) => void;
  type: EvaulatorType;
  userId: number;
  teamId: number;
  specId: number;
}
interface AddEvaluatorModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AddEvaluatorModal({
  closeModal,
  isOpen,
  modalData,
}: AddEvaluatorModalProps) {
  const { type, userId, teamId, specId, onSubmit } =
    modalData as AddEvaluatorModalData;
  const [selected, setSelected] = useState<EvaluateUser[]>([]);
  const selectedSpecs = useAppSelector((state) => state.rates.selectedSpecs);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить оценщика"
      onSubmit={() => {
        onSubmit(selected);
        closeModal();
      }}
      submitText="Добавить"
      className="w-full sm:max-w-4xl"
    >
      <EvaluatorsForm
        selectedSpecs={selectedSpecs}
        selected={selected}
        setSelected={setSelected}
        specId={specId}
        teamId={teamId}
        type={type}
        userId={userId}
      />
    </Modal>
  );
}
