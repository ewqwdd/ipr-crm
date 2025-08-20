import { rate360Api } from '@/shared/api/rate360Api';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';
import DatePickerLight from '@/shared/ui/DatePickerLight';
import { Modal } from '@/shared/ui/Modal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DateObject, toDateObject } from 'react-multi-date-picker';

interface EndMeetingModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

type ModalData = { rateId: number };

export default function EndMeetingModal({
  isOpen,
  modalData,
  closeModal,
}: EndMeetingModalProps) {
  const [date, setDate] = useState<DateObject | undefined>(
    toDateObject(new Date()),
  );
  const invalidateTags = useInvalidateTags();
  const [mutate, { isLoading }] = rate360Api.useConfirmMeetMutation();

  const { rateId } = modalData as ModalData;

  const handleSubmit = async () => {
    try {
      if (!date) return toast.error('Выберите дату завершения');
      await mutate({ id: rateId, date: date.toDate() }).unwrap();
      invalidateTags(['Ipr']);
      closeModal();
    } catch (error) {
      toast.error('Ошибка при завершении встречи');
      console.error(error);
    }
  };

  return (
    <Modal
      open={!!isOpen}
      setOpen={closeModal}
      title={'Завершить встречу?'}
      loading={isLoading}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1 mt-3">
        <span className="text-sm font-medium text-gray-600">
          Выберите дату завершения
        </span>
        <DatePickerLight
          value={date}
          onChange={(date) => setDate(Array.isArray(date) ? date[0] : date)}
        />
      </div>
    </Modal>
  );
}
