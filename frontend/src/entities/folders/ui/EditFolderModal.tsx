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

  const { id, name, folderType } = (modalData as {
    id: number;
    name: string;
    folderType: FolderType;
  }) || { id: -1, name: '', folderType: FolderType.PRODUCT };

  const [updateProductFolder, productProps] =
    foldersApi.useUpdateProductFolderMutation();
  const [updateTeamFolder, teamProps] =
    foldersApi.useUpdateTeamFolderMutation();
  const [updateSpecFolder, specProps] =
    foldersApi.useUpdateSpecFolderMutation();

  useEffect(() => {
    if (isOpen && name) {
      setValue(name);
    }
  }, [isOpen, name]);

  const isLoading =
    folderType === FolderType.PRODUCT
      ? productProps.isLoading
      : folderType === FolderType.TEAM
        ? teamProps.isLoading
        : specProps.isLoading;

  const isSuccess =
    folderType === FolderType.PRODUCT
      ? productProps.isSuccess
      : folderType === FolderType.TEAM
        ? teamProps.isSuccess
        : specProps.isSuccess;

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

  const handleSubmit = (newName: string) => {
    if (!newName.trim()) {
      toast.error('Название папки не может быть пустым');
      return;
    }

    if (!id) {
      toast.error('ID папки не указан');
      return;
    }

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

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, closeModal]);

  useEffect(() => {
    if (isError) {
      let errorMessage = 'Ошибка при обновлении папки';
      if (generalService.isFetchBaseQueryError(error)) {
        errorMessage = error.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  }, [isError, error]);

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
