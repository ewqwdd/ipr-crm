import { Spec, User } from '@/entities/user';
import { Rate } from '../../types/types';
import { Modal } from '@/shared/ui/Modal';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import EvaluatorsList from './partials/EvaluatorsList';
import { Indicator } from '@/entities/skill';
import { useMemo } from 'react';
import { useModal } from '@/app/hooks/useModal';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useAppDispatch } from '@/app';
import { ratesActions } from '../../model/rateSlice';

interface RateStatsModalData {
  rate: Rate;
  spec: Spec;
  user: User;
  indicators: Indicator[];
}
interface RateStatsModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function RateStatsModal({
  closeModal,
  isOpen,
  modalData,
}: RateStatsModalProps) {
  const { rate, spec, user } = modalData as RateStatsModalData;
  const isAdmin = useIsAdmin();
  const { openModal } = useModal();
  const dispatch = useAppDispatch();

  const selfRates = rate.userRates.filter((r) => r.userId === user.id);
  const indicators = useMemo(
    () =>
      rate.competencyBlocks.flatMap((block) =>
        block.competencies.flatMap((comp) => comp.indicators),
      ),
    [rate],
  );

  const isSelfRated = selfRates.length < indicators.length;
  const percent =
    indicators.length === 0
      ? 1
      : rate.userRates.length /
        (indicators.length * (rate.evaluators.length + 1));

  const icon = isSelfRated ? (
    <XCircleIcon className="size-5 text-red-500" />
  ) : (
    <CheckCircleIcon className="size-5 text-green-500" />
  );

  return (
    <Modal title="Статистика" open={isOpen} setOpen={closeModal} footer={false}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 py-2 items-center">
          {icon}
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-lg text-gray-800">{user.username}</h3>
            <p className="flex gap-2 text-gray-500 text-sm">
              <span>Специализация:</span>
              <span className="text-gray-800">{spec?.name}</span>
            </p>
          </div>
          {/* CHANGE TO VALID STATS LATER */}
          <span className="text-xl text-gray-800">
            {Math.round(percent * 100)}%
          </span>
        </div>
        <EvaluatorsList
          evaluators={rate.evaluators}
          indicators={indicators}
          rates={rate.userRates}
          type="CURATOR"
        />
        <EvaluatorsList
          evaluators={rate.evaluators}
          indicators={indicators}
          rates={rate.userRates}
          type="TEAM_MEMBER"
        />
        <EvaluatorsList
          evaluators={rate.evaluators}
          indicators={indicators}
          rates={rate.userRates}
          type="SUBORDINATE"
        />
        {isAdmin && !rate.plan && (
          <PrimaryButton
            onClick={() => {
              dispatch(ratesActions.setEditEvaluatorsFromRate(rate));
              openModal('EDIT_EVALUATORS', { rate });
            }}
          >
            Изменить
          </PrimaryButton>
        )}
      </div>
    </Modal>
  );
}
