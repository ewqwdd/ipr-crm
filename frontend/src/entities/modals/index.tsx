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
    case 'ADD_COMPETENCY_MATERIAL':
      return <AddMaterialsModal type="COMPETENCY" {...updatedModalProps} />;
    case 'ADD_INDICATOR_MATERIAL':
      return <AddMaterialsModal type="INDICATOR" {...updatedModalProps} />;
    default:
      break;
  }
};

export default ModalWrapper;
