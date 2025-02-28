import { Modal } from '@/shared/ui/Modal';
import { CustomCard, TaskStatus } from '../../model/types';
import Deadline from '../partials/tasks/Deadline';
import TaskItem from '../partials/tasks/TaskItem';
import { addCard, removeCard } from '@caldwell619/react-kanban';
import { useAppDispatch } from '@/app';
import { boardActions } from '../../model/boardSlice';
import MaterialIcon from '@/entities/material/ui/MaterialIcon';

type ModalData = { card: CustomCard; userId: number };

interface TaskPreviewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

export default function TaskPreviewModal({
  isOpen,
  modalData,
  closeModal,
}: TaskPreviewModalProps) {
  const { card, userId } = modalData as ModalData;
  const { task } = card;
  const dispatch = useAppDispatch();

  const statusChange = (status: TaskStatus) => {
    dispatch(
      boardActions.setBoardCallback((currentBoard) => {
        const removed = removeCard<CustomCard>(
          currentBoard,
          { id: task.status },
          card,
        );
        return addCard(removed, { id: status }, card);
      }),
    );
  };

  return (
    <Modal open={isOpen} setOpen={closeModal} title="Задача" footer={false}>
      <div className="flex flex-col py-4 gap-4">
        <h2 className="flex gap-2 text-gray-800 text-sm">
          {task.indicator ? (
            <>
              <span>Индикатор:</span>
              <span>{task.indicator?.name}</span>
            </>
          ) : (
            <>
              <span>Индикатор:</span>
              <span>{task.competency?.name}</span>
            </>
          )}
        </h2>
        <div className="w-full h-px bg-gray-200 mb-2"></div>

        <h3>{task.material?.name}</h3>

        <a
          href={task.material?.url}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 font-medium flex gap-2 items-center text-sm mb-6"
        >
          {task.material?.contentType && (
            <MaterialIcon
              className="size-5"
              type={task.material?.contentType}
            />
          )}{' '}
          Материалы
        </a>

        <TaskItem.Status
          id={task.id}
          status={task.status}
          userId={userId}
          onChange={statusChange}
        />
        <div className="gap-2 flex items-center [&>*]:text-sm [&_button]:p-1 [&_svg]:size-4">
          <span className="flex gap-2 text-gray-800 text-sm">Дедлайн:</span>
          <Deadline
            deadline={task.deadline}
            status={task.status}
            id={task.id}
          />
        </div>
      </div>
    </Modal>
  );
}
