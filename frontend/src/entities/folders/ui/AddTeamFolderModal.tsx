import { Modal } from '@/shared/ui/Modal';
import { useEffect, useMemo, useState } from 'react';
import { foldersApi } from '@/shared/api/foldersApi';
import toast from 'react-hot-toast';
import { isFetchBaseQueryError } from '@/shared/lib/isFetchBaseQuery';
import { Autocomplete } from '@/shared/ui/Autocomplete';
import { teamsApi } from '@/shared/api/teamsApi';

interface AddTeamFolderModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AddTeamFolderModal({
  isOpen,
  modalData,
  closeModal,
}: AddTeamFolderModalProps) {
  const [value, setValue] = useState('');
  const { productId, name } = (modalData as {
    productId: number;
    name: string;
  }) || { productId: -1 };
  const { data, isLoading } = teamsApi.useGetTeamsQuery();

  const [createTeamFolder, teamProps] =
    foldersApi.useCreateTeamFolderMutation();

  const teamSubmit = (name: string) => {
    if (!name.trim()) {
      toast.error('Название папки не может быть пустым');
      return;
    }

    if (!productId) {
      toast.error('Не выбран продукт');
      return;
    }

    createTeamFolder({ name, productId });
  };

  useEffect(() => {
    if (teamProps.isSuccess) {
      closeModal();
      setValue('');
    }
  }, [teamProps.isSuccess, closeModal]);

  useEffect(() => {
    if (teamProps.isError) {
      let errorMessage = 'Ошибка при добавлении папки команды';
      if (isFetchBaseQueryError(teamProps.error)) {
        errorMessage = teamProps.error.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  }, [teamProps.isError, teamProps.error]);

  const teamNames = useMemo(() => {
    return data?.list.map((team) => team.name) || [];
  }, [data]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить команду"
      onSubmit={() => teamSubmit(value)}
      submitText="Добавить"
      loading={teamProps.isLoading}
    >
      <div className="flex flex-col gap-4 mt-3">
        <p className="text-sm text-gray-500">
          Продукт: <span className="font-medium text-gray-700">{name}</span>
        </p>
        <Autocomplete
          placeholder="Название команды"
          value={value}
          onChange={(e) => setValue(e)}
          options={teamNames}
          loading={isLoading}
        />
      </div>
    </Modal>
  );
}
