import { Modal } from '@/shared/ui/Modal';
import { FC } from 'react';
interface ChooseCompetencyBlockModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

const ChooseCompetencyBlockModal: FC<ChooseCompetencyBlockModalProps> = ({
  isOpen,
  modalData,
  closeModal,
}) => {
  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Новая специализация"
      // onSubmit={blockSubmit}
      submitText="Добавить"
      // loading={mutateLoading}
    >
      <div className="flex flex-col gap-4 mt-4">
        {/* <InputWithLabelLight
              placeholder="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextArea
              placeholder="Описание"
              onChange={(e) => setDescription(e.target.value)}
            /> */}
      </div>
    </Modal>
  );
};

export default ChooseCompetencyBlockModal;
