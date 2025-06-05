import { Modal } from '@/shared/ui/Modal';
import { useEffect, useMemo, useState } from 'react';
import { foldersApi } from '@/shared/api/foldersApi';
import toast from 'react-hot-toast';
import { Autocomplete } from '@/shared/ui/Autocomplete';
import { teamsApi } from '@/shared/api/teamsApi';
import { generalService } from '@/shared/lib/generalService';

interface AddProductFolderModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AddProductFolderModal({
  isOpen,
  closeModal,
}: AddProductFolderModalProps) {
  const [value, setValue] = useState('');

  const [createCompetencyBlock, blockProps] =
    foldersApi.useCreateProductFolderMutation();

  const { data, isLoading } = teamsApi.useGetTeamsQuery();

  const blockSubmit = (name: string) => {
    if (!name.trim()) {
      toast.error('Название папки не может быть пустым');
      return;
    }
    createCompetencyBlock({ name });
  };

  useEffect(() => {
    if (blockProps.isSuccess) {
      closeModal();
      setValue('');
    }
  }, [blockProps.isSuccess, closeModal]);

  useEffect(() => {
    if (blockProps.isError) {
      let errorMessage = 'Ошибка при добавлении папки';
      if (generalService.isFetchBaseQueryError(blockProps.error)) {
        errorMessage = blockProps.error.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  }, [blockProps.isError, blockProps.error]);

  const teamNames = useMemo(
    () => data?.structure.map((team) => team.name) || [],
    [data],
  );

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить продукт"
      onSubmit={() => blockSubmit(value)}
      submitText="Добавить"
      loading={isLoading}
    >
      <div className="flex flex-col gap-4 mt-3">
        <Autocomplete
          value={value}
          onChange={(e) => setValue(e)}
          placeholder="Название блока"
          options={teamNames || []}
        />
      </div>
    </Modal>
  );
}
