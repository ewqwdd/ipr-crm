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
import AddMaterialsModal from '../material/ui/AddMaterialsModal';
import EditSpecialization from '../skill/ui/EditSpecialization';
import AddSpecialization from '../skill/ui/AddSpecialization';
import MaterialsList from '../skill/ui/MaterialsList';
import ChooseCompetencyBlockModal from '../skill/ui/ChooseCompetencyBlockModal';
import {
  AddEvaluatorModal,
  ConfirmEvaluatorsModal,
  EditEvaluatorsModal,
  EvaluateModal,
  RateStatsModal,
} from '../rates';
import { InviteModal } from '../user/ui/InviteModal';
import { PasswordResetModal } from '@/widgets/PasswordResetModal';
import AddTaskModal from '@/widgets/AddTaskModal';
import { DeleteTaskModal, TaskPreviewModal } from '../ipr';
import RateTestsModal from '../test/ui/RateTestsModal';
import { AssessmentAssignUsersModal } from '@/widgets/AssessmentAssignUsersModal';
import { ImportUsers } from '../user/ui/ImportUsers';
import { RateSurveyModal } from '../survey';
import { CreateSupportTicketModal } from '../support';

export type ModalProps = {
  isOpen: boolean;
  modalData: unknown;
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
    case 'CONFIRM_EVALUATORS':
      return <ConfirmEvaluatorsModal {...updatedModalProps} />;
    case 'INVITE':
      return <InviteModal {...updatedModalProps} />;
    case 'PASSWORD_RESET':
      return <PasswordResetModal {...updatedModalProps} />;
    case 'ADD_TASK_INDICATOR':
      return <AddTaskModal type={'INDICATOR'} {...updatedModalProps} />;
    case 'ADD_TASK_COMPETENCY':
      return <AddTaskModal type="COMPETENCY" {...updatedModalProps} />;
    case 'DELETE_TASK':
      return <DeleteTaskModal {...updatedModalProps} />;
    case 'PREVIEW_TASK':
      return <TaskPreviewModal {...updatedModalProps} />;
    case 'ASSESMENT_ASSIGN_USERS':
      return <AssessmentAssignUsersModal {...updatedModalProps} />;
    case 'RATE_TESTS':
      return <RateTestsModal {...updatedModalProps} />;
    case 'IMPORT_USERS':
      return <ImportUsers {...updatedModalProps} />;
    case 'EDIT_EVALUATORS':
      return <EditEvaluatorsModal {...updatedModalProps} />;
    case 'RATE_SURVEYS':
      return <RateSurveyModal {...updatedModalProps} />;
    case 'CREATE_SUPPORT_TICKET':
      return <CreateSupportTicketModal {...updatedModalProps} />;
    default:
      break;
  }
};

export default ModalWrapper;
