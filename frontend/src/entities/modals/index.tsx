import { FC } from 'react';
import {
  AddCompetencyBlockModal,
  AddCompetencyModal,
  AddIndicatorModal,
  EditSkillsModal,
} from '../skill';
import { useModal } from '@/app/hooks/useModal';
import { useAppSelector } from '@/app';
import { ConfirmModal } from '@/widgets/ConfirmModal';
import AddMaterialsModal from '../skill/ui/AddMaterialsModal';
import EditSpecialization from '../skill/ui/EditSpecialization';
import AddSpecialization from '../skill/ui/AddSpecialization';
import MaterialsList from '../skill/ui/MaterialsList';
import ChooseCompetencyBlockModal from '../skill/ui/ChooseCompetencyBlockModal';
import { AddEvaluatorModal, EvaluateModal, RateStatsModal } from '../rates';

export type ModalProps = {
  isOpen: boolean;
  modalData: any;
  closeModal: () => void;
};

const ModalWrapper: FC = () => {
  const { modalType, ...modalProps } = useAppSelector((state) => state.modal);
  const { closeModal } = useModal();

  const updatedModalProps = {
    ...modalProps,
    closeModal,
  };

  if (!modalType) return;

  switch (modalType) {
    case 'ADD_COMPETENCY_BLOCK':
      return <AddCompetencyBlockModal {...updatedModalProps} />;
    case 'ADD_COMPETENCY':
      return <AddCompetencyModal {...updatedModalProps} />;
    case 'ADD_INDICATOR':
      return <AddIndicatorModal {...updatedModalProps} />;
    case 'CONFIRM':
      return <ConfirmModal {...updatedModalProps} />;
    case 'EDIT_SKILL':
      return <EditSkillsModal {...updatedModalProps} />;
    case 'ADD_EVALUATOR':
      return <AddEvaluatorModal {...updatedModalProps} />;
    case 'RATE_STATS':
      return <RateStatsModal {...updatedModalProps} />;
    case 'EVALUATE':
      return <EvaluateModal {...updatedModalProps} />;
    case 'ADD_COMPETENCY_MATERIAL':
      return <AddMaterialsModal type="COMPETENCY" {...updatedModalProps} />;
    case 'ADD_INDICATOR_MATERIAL':
      return <AddMaterialsModal type="INDICATOR" {...updatedModalProps} />;
    case 'ADD_SPECIALIZATION':
      return <AddSpecialization {...updatedModalProps} />;
    case 'EDIT_SPECIALIZATION':
      return <EditSpecialization {...updatedModalProps} />;
    case 'MATERIALS_LIST':
      return <MaterialsList {...updatedModalProps} />;
    case 'CHOOSE_COMPETENCY_BLOCK':
      return <ChooseCompetencyBlockModal {...updatedModalProps} />;
    default:
      break;
  }
};

export default ModalWrapper;
