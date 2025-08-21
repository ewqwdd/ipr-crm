import { CaseRate } from '@/entities/cases';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { generalService } from '@/shared/lib/generalService';
import { Avatar } from '@/shared/ui/Avatar';
import { Modal } from '@/shared/ui/Modal';
import CaseEvaluatorsAdmin from './CaseEvaluatorsAdmin';

interface CaseEvaluatorsModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

type ModalData = { data: CaseRate };

export default function CaseEvaluatorsModal({
  isOpen,
  closeModal,
  modalData,
}: CaseEvaluatorsModalProps) {
  const isAdmin = useIsAdmin();
  const { data } = modalData as ModalData;

  return (
    <Modal
      footer={false}
      open={isOpen}
      setOpen={closeModal}
      title="Оценивающие кейса"
    >
      <div className="flex flex-col gap-3">
        {isAdmin ? (
          <CaseEvaluatorsAdmin closeModal={closeModal} data={data} />
        ) : (
          <div className="flex flex-col gap-3">
            {data.evaluators.map((evaluator) => (
              <div className="flex gap-2 items-center text-gray-600 font-medium">
                <Avatar
                  src={generalService.transformFileUrl(evaluator.user.avatar)}
                />
                <span>{evaluator.user.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
