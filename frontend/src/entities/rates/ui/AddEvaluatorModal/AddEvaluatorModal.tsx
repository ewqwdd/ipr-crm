import { Modal } from '@/shared/ui/Modal';
import { EvaluateUser } from '../../types/types';
import { useAppSelector } from '@/app';
import { useState } from 'react';
import EvaluatorsForm from '../EvaluatorsForm/EvaluatorsForm';
import { TeamFilters } from '@/features/team/TeamFilters';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { EvaulatorType } from '@/shared/types/AssesmentBaseType';

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
      footer={false}
      submitText="Добавить"
      className="w-full sm:max-w-4xl"
    >
      <div className="flex justify-end gap-3 my-3">
        <SecondaryButton onClick={closeModal}>Отмена</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            onSubmit(selected);
            closeModal();
          }}
        >
          Добавить
        </PrimaryButton>
      </div>
      <TeamFilters>
        {(filters) => (
          <EvaluatorsForm
            selectedSpecs={selectedSpecs}
            selected={selected}
            setSelected={setSelected}
            specId={specId}
            teamId={teamId}
            type={type}
            userId={userId}
            {...filters}
          />
        )}
      </TeamFilters>
    </Modal>
  );
}
