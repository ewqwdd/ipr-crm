import { Modal } from '@/shared/ui/Modal';
import { EvaluateUser, EvaulatorType } from '../../types/types';
import { useAppDispatch, useAppSelector } from '@/app';
import { useState } from 'react';
import { ratesActions } from '../../model/rateSlice';
import EvaluatorsForm from '../EvaluatorsForm/EvaluatorsForm';

interface AddEvaluatorModalData {
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
  const { type, userId, teamId, specId } = modalData as AddEvaluatorModalData;
  const [selected, setSelected] = useState<EvaluateUser[]>([]);
  const dispatch = useAppDispatch();
  const selectedSpecs = useAppSelector((state) => state.rates.selectedSpecs);

  const onSubmit = () => {
    dispatch(
      ratesActions.setSpecsForUser({
        teamId,
        specId,
        userId,
        type,
        evaluators: selected,
      }),
    );
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить оценщика"
      onSubmit={onSubmit}
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
