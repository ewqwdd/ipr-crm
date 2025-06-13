import { Modal } from '@/shared/ui/Modal';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useEffect, useState } from 'react';
import { foldersApi } from '@/shared/api/foldersApi';
import toast from 'react-hot-toast';
import { FolderType } from '../types';
import { generalService } from '@/shared/lib/generalService';

interface EditFolderModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function EditFolderModal({
  isOpen,
  modalData,
  closeModal,
}: EditFolderModalProps) {
  const [value, setValue] = useState('');

  // Получаем данные из modalData
  const { id, name, folderType } = (modalData as {
    id: number;
    name: string;
    folderType: FolderType;
  }) || { id: -1, name: '', folderType: FolderType.PRODUCT };

  // Хуки для разных типов папок
  const [updateProductFolder, productProps] =
    foldersApi.useUpdateProductFolderMutation();
  const [updateTeamFolder, teamProps] =
    foldersApi.useUpdateTeamFolderMutation();
  const [updateSpecFolder, specProps] =
    foldersApi.useUpdateSpecFolderMutation();

  // Устанавливаем начальное значение при открытии модалки
  useEffect(() => {
    if (isOpen && name) {
      setValue(name);
    }
  }, [isOpen, name]);

  // Определяем текущее состояние загрузки в зависимости от типа папки
  const isLoading =
    folderType === FolderType.PRODUCT
      ? productProps.isLoading
      : folderType === FolderType.TEAM
        ? teamProps.isLoading
        : specProps.isLoading;

  // Определяем успешное выполнение в зависимости от типа папки
  const isSuccess =
    folderType === FolderType.PRODUCT
      ? productProps.isSuccess
      : folderType === FolderType.TEAM
        ? teamProps.isSuccess
        : specProps.isSuccess;

  // Определяем ошибку в зависимости от типа папки
  const error =
    folderType === FolderType.PRODUCT
      ? productProps.error
      : folderType === FolderType.TEAM
        ? teamProps.error
        : specProps.error;

  const isError =
    folderType === FolderType.PRODUCT
      ? productProps.isError
      : folderType === FolderType.TEAM
        ? teamProps.isError
        : specProps.isError;

  // Функция для отправки запроса на обновление
  const handleSubmit = (newName: string) => {
    if (!newName.trim()) {
      toast.error('Название папки не может быть пустым');
      return;
    }

    if (!id) {
      toast.error('ID папки не указан');
      return;
    }

    // Вызываем соответствующую функцию в зависимости от типа папки
    switch (folderType) {
      case FolderType.PRODUCT:
        updateProductFolder({ id, dto: { name: newName } });
        break;
      case FolderType.TEAM:
        updateTeamFolder({ id, dto: { name: newName } });
        break;
      case FolderType.SPEC:
        updateSpecFolder({ id, dto: { name: newName } });
        break;
      default:
        toast.error('Неизвестный тип папки');
    }
  };

  // Обработка успешного выполнения
  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, closeModal]);

  // Обработка ошибок
  useEffect(() => {
    if (isError) {
      let errorMessage = 'Ошибка при обновлении папки';
      if (generalService.isFetchBaseQueryError(error)) {
        errorMessage = error.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  }, [isError, error]);

  // Определяем заголовок модалки в зависимости от типа папки
  const getModalTitle = () => {
    switch (folderType) {
      case FolderType.PRODUCT:
        return 'Редактировать продукт';
      case FolderType.TEAM:
        return 'Редактировать команду';
      case FolderType.SPEC:
        return 'Редактировать спецификацию';
      default:
        return 'Редактировать папку';
    }
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={getModalTitle()}
      onSubmit={() => handleSubmit(value)}
      submitText="Сохранить"
      loading={isLoading}
    >
      <div className="flex flex-col gap-4 mt-3">
        <InputWithLabelLight
          placeholder="Название папки"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Modal>
  );
}
