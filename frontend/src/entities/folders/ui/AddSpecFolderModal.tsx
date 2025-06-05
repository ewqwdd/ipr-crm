import { Modal } from '@/shared/ui/Modal';
import { useEffect, useState } from 'react';
import { foldersApi } from '@/shared/api/foldersApi';
import toast from 'react-hot-toast';
import EditMultipleSpecs from './EditMultipleSpecs';
import { generalService } from '@/shared/lib/generalService';

interface AddSpecFolderModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AddSpecFolderModal({
  isOpen,
  modalData,
  closeModal,
}: AddSpecFolderModalProps) {
  const { teamId, name } = (modalData as { teamId: number; name: string }) || {
    teamId: -1,
  };
  const [specs, setSpecs] = useState<string[]>(['']);

  const [createSpecFolder, specProps] =
    foldersApi.useCreateSpecFolderMutation();

  const specSubmit = (specs: string[]) => {
    const filtered = specs.filter((s) => s.trim() !== '');
    if (filtered.length === 0) {
      toast.error('Необходимо указать хотя бы одну специализацию');
      return;
    }

    if (!teamId) {
      toast.error('Не выбрана команда');
      return;
    }

    createSpecFolder({ specs: Array.from(new Set(filtered)), teamId });
  };

  useEffect(() => {
    if (specProps.isSuccess) {
      closeModal();
      setSpecs(['']);
    }
  }, [specProps.isSuccess, closeModal]);

  useEffect(() => {
    if (specProps.isError) {
      let errorMessage = 'Ошибка при добавлении папки спецификации';
      if (generalService.isFetchBaseQueryError(specProps.error)) {
        errorMessage = specProps.error.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  }, [specProps.isError, specProps.error]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить специализацию"
      onSubmit={() => specSubmit(specs)}
      submitText="Добавить"
      loading={specProps.isLoading}
    >
      <div className="flex flex-col gap-4 mt-3">
        <p className="text-sm text-gray-500">
          Команда: <span className="font-medium text-gray-700">{name}</span>
        </p>
        <EditMultipleSpecs specs={specs} setSpecs={setSpecs} />
      </div>
    </Modal>
  );
}
