import { Task } from '@/entities/ipr/model/types';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Calendar } from 'react-multi-date-picker';
import { iprApi } from '@/shared/api/iprApi';
import { useAppDispatch } from '@/app';
import { formatDate } from '@/shared/lib/formatDate';

type Status = Task['status'];

const DeadlineTooltip: FC<{
  isOpen: boolean;
  closeModal: () => void;
  defaultValue?: string | null;
  id: number;
  onUpdate: (newDeadline: string | null) => void;
}> = memo(({ isOpen, closeModal, defaultValue = null, id, onUpdate }) => {
  const [date, setDate] = useState<Date | null>(
    defaultValue ? new Date(defaultValue) : null,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDate(defaultValue ? new Date(defaultValue) : null);
  }, [defaultValue]);

  const closeHandler = () => {
    closeModal();
  };

  const submitDeadline = () => {
    if (
      date !== null &&
      defaultValue !== null &&
      date.getTime() === new Date(defaultValue).getTime()
    ) {
      toast.error('Измени дедлайн');
      return;
    }
    $api
      .post('/ipr/task/deadline', { id, deadline: date?.toISOString() })
      .then(() => {
        const newDeadline = date?.toISOString() ?? null;
        onUpdate(newDeadline);
        closeModal();
        dispatch(iprApi.util.invalidateTags(['ipr']));
        toast.success('Дедлайн успешно обновлен');
      })
      .catch(() => {
        closeModal();
        toast.error('Ошибка при обновлении дедлайна');
      });
  };

  return (
    <div
      className={cva(
        'fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center',
        {
          visible: isOpen,
          hidden: !isOpen,
        },
      )}
      onClick={closeHandler}
    >
      <div
        className="flex flex-col items-end gap-2 bg-white pt-4 rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          value={date}
          onChange={(date) => {
            if (date) {
              setDate(date.toDate());
            }
          }}
          minDate={new Date()}
          className="!shadow-none  px-6"
        />
        <div className="flex justify-end border-t border-t-black/5 px-6 py-2">
          <SoftButton size="sm" onClick={submitDeadline}>
            Выбрать
          </SoftButton>
        </div>
      </div>
    </div>
  );
});

const Deadline: FC<{
  deadline: string | null;
  status: Status;
  id: number;
  className?: string;
  onUdpate?: (newDeadline: string | null) => void;
}> = ({ deadline: initialDeadline, status, id, className, onUdpate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (status === 'COMPLETED') {
    return (
      <div className="text-sm text-gray-500">
        {initialDeadline && formatDate(initialDeadline)}
      </div>
    );
  }

  const deleteDeadline = () => {
    $api
      .post('/ipr/task/deadline', { id, deadline: null })
      .then(() => {
        dispatch(iprApi.util.invalidateTags(['ipr']));
        updateDeadline(null);
        toast.success('Дедлайн успешно удален');
      })
      .catch(() => {
        toast.error('Ошибка при удалении дедлайна');
      });
  };

  const updateDeadline = (newDeadline: string | null) => {
    onUdpate?.(newDeadline);
  };

  return initialDeadline ? (
    <div className={cva('flex gap-2 items-center max-sm:text-sm', className)}>
      <div>{formatDate(initialDeadline)}</div>
      <SoftButton
        className="rounded-full sm:p-2 p-1"
        size="xs"
        onClick={openModal}
      >
        <PencilIcon className="sm:size-5 size-4" />
      </SoftButton>
      <SoftButton
        danger
        className="rounded-full sm:p-2 p-1"
        size="xs"
        onClick={deleteDeadline}
      >
        <TrashIcon className="sm:size-5 size-4" />
      </SoftButton>
      <DeadlineTooltip
        closeModal={closeModal}
        isOpen={isOpen}
        defaultValue={initialDeadline}
        id={id}
        onUpdate={updateDeadline}
      />
    </div>
  ) : (
    <>
      <SoftButton className="" size="xs" onClick={openModal}>
        Добавить
      </SoftButton>
      <DeadlineTooltip
        closeModal={closeModal}
        isOpen={isOpen}
        id={id}
        onUpdate={updateDeadline}
      />
    </>
  );
};

export default memo(Deadline);
