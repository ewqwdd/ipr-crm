import { supportApi } from '@/shared/api/supportApi';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateSupportTicketDto } from '../config/types';
import { TextArea } from '@/shared/ui/TextArea';
import toast from 'react-hot-toast';

interface CreateSupportTicketModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

type ErrorsState = Partial<
  Record<keyof CreateSupportTicketDto, string | undefined>
>;

export default function CreateSupportTicketModal({
  closeModal,
  isOpen,
}: CreateSupportTicketModalProps) {
  const [mutate, { isLoading, isSuccess, isError }] =
    supportApi.useCreateTicketMutation();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [errors, setErrors] = useState<ErrorsState>({});

  const onTitleChange = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      title: undefined,
    }));
  }, []);
  const onDescriptionChange = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      description: undefined,
    }));
  }, []);

  const onSubmit = useCallback(() => {
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const newErrors: ErrorsState = {};
    if (!title) {
      newErrors.title = 'Введите заголовок';
    }
    if (!description) {
      newErrors.description = 'Введите описание';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    const data: CreateSupportTicketDto = {
      title: title!,
      description: description!,
    };
    mutate(data);
  }, [mutate]);

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    } else if (isError) {
      toast.error('Ошибка создания тикета');
    }
  }, [isSuccess, closeModal, isError]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Новый запрос в техподдержку"
      onSubmit={onSubmit}
      submitText="Создать"
      loading={isLoading}
    >
      <div className="flex flex-col gap-2 mt-6">
        <InputWithLabelLight
          label="Заголовок"
          ref={titleRef}
          error={errors.title}
          onChange={onTitleChange}
        />
        <TextArea
          rows={4}
          label="Описание"
          ref={descriptionRef}
          error={errors.description}
          onChange={onDescriptionChange}
        />
      </div>
    </Modal>
  );
}
