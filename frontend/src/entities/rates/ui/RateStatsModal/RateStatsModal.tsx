import { Spec, User } from '@/entities/user';
import { Rate } from '../../types/types';
import { Modal } from '@/shared/ui/Modal';
import { XCircleIcon } from '@heroicons/react/outline';
import EvaluatorsList from './partials/EvaluatorsList';

interface RateStatsModalData {
  rate: Rate;
  spec: Spec;
  user: User;
}
interface RateStatsModalProps {
  isOpen: boolean;
  modalData: RateStatsModalData;
  closeModal: () => void;
}

export default function RateStatsModal({
  closeModal,
  isOpen,
  modalData,
}: RateStatsModalProps) {
  const { rate, spec, user } = modalData;
  const evaluatorsCount = rate.evaluators.length;
  const ratesCount = rate.userRates.length;

  return (
    <Modal title="Статистика" open={isOpen} setOpen={closeModal} footer={false}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 py-2 items-center">
          <XCircleIcon className="size-7 text-red-500" />
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-lg text-gray-800">{user.username}</h3>
            <p className="flex gap-2 text-gray-500 text-sm">
              <span>Специализация:</span>
              <span className="text-gray-800">{spec.name}</span>
            </p>
          </div>
          {/* CHANGE TO VALID STATS LATER */}
          <span className="text-xl text-gray-800">0</span>
        </div>
        <EvaluatorsList evaluators={rate.evaluators} type="CURATOR" />
        <EvaluatorsList evaluators={rate.evaluators} type="TEAM_MEMBER" />
        <EvaluatorsList evaluators={rate.evaluators} type="SUBORDINATE" />
      </div>
    </Modal>
  );
}
