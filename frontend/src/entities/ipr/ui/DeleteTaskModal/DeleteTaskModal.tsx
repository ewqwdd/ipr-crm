import { Modal } from '@/shared/ui/Modal';
import { Task } from '../../model/types';
import { useAppDispatch, useAppSelector } from '@/app';
import { Checkbox } from '@/shared/ui/Checkbox';
import { useState } from 'react';
import { boardActions } from '../../model/boardSlice';
import { $api } from '@/shared/lib/$api';
import toast from 'react-hot-toast';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';

interface DeleteTaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

export default function DeleteTaskModal({
  isOpen,
  modalData,
  closeModal,
}: DeleteTaskModalProps) {
  const { task } = modalData as { task: Task };
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);
  const board = useAppSelector((state) => state.board.board);
  const invalidateTags = useInvalidateTags();

  const onDelete = async () => {
    const prev = board;
    dispatch(
      boardActions.removeCard({
        columnId: task.status,
        cardId: task.id.toString(),
      }),
    );

    const revert = () => {
      toast.error('Не удалось удалить задачу');
      if (prev) dispatch(boardActions.setBoard(prev));
    };

    const fn = checked
      ? $api
          .delete('/ipr/task', {
            data: { ids: [task.id] },
          })
          .then(() => invalidateTags([{ type: 'Ipr', id: task.planId }]))
      : $api.post('/ipr/task/remove-from-board', {
          id: task.id,
        });

    fn.catch((e) => {
      console.error(e);
      revert();
    });

    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Удаление задачи"
      variant="error"
      onSubmit={onDelete}
    >
      <div className="flex flex-col gap-4 mt-4">
        <p className="text-sm text-gray-600">
          Задача будет удалена только с доски. Если хотите удалить задачу из
          плана развития, установите галочку ниже.
        </p>
        <Checkbox
          title="Удалить задачу из плана развития"
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
        />
      </div>
    </Modal>
  );
}
