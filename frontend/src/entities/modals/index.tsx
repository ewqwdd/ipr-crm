import { FC } from 'react';
import { useSelector } from 'react-redux';
import {
  AddCompetencyBlockModal,
  AddCompetencyModal,
  AddIndicatorModal,
} from '../skill';
import { useModal } from '@/app/hooks/useModal';

export type ModalProps = {
  isOpen: boolean;
  modalData: any;
  closeModal: () => void;
};

const ModalWrapper: FC = () => {
  const { isOpen, modalType, modalData } = useSelector((state) => state.modal);
  const { closeModal } = useModal();

  if (!isOpen || !modalType) return;

  const modalProps: ModalProps = {
    isOpen,
    modalData,
    closeModal,
  };

  switch (modalType) {
    case 'ADD_COMPETENCY_BLOCK':
      return <AddCompetencyBlockModal {...modalProps} />;
    case 'ADD_COMPETENCY':
      return <AddCompetencyModal {...modalProps} />;
    case 'ADD_INDICATOR':
      return <AddIndicatorModal {...modalProps} />;

    default:
      break;
  }
};

export default ModalWrapper;
