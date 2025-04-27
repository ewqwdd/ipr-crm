import { $api } from '@/shared/lib/$api';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { UploadFile } from '@/shared/ui/UploadFile';
import { useEffect, useState } from 'react';
import { ImportUsersStateType } from './types';
import ImportUsersTable from './ImportUsersTable';
import { usersApi } from '@/shared/api/usersApi';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/app';
import { teamsApi } from '@/shared/api/teamsApi';

interface ImportModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function ImportUsers({ closeModal, isOpen }: ImportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<File>();
  const [error, setError] = useState<string | null>(null);
  const [response, setReponse] = useState<ImportUsersStateType>(null);
  const [addMultiple, addMultipleState] =
    usersApi.useAddMultipleUsersMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (!response) return toast.error('Пожалуйста, загрузите файл для импорта');

    if (response.data.length === 0)
      return toast.error('Пожалуйста, добавьте пользователей для импорта');

    addMultiple(
      response.data.map((row) => ({
        email: row.Почта,
        username: row.Ник,
        department:
          row.Департамент.trim() !== '-' ? row.Департамент : undefined,
        direction: row.Направление.trim() !== '-' ? row.Направление : undefined,
        product: row.Продукт.trim() !== '-' ? row.Продукт : undefined,
        leader: row.Лидер?.trim() === 'Да',
      })),
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(file);
      setError(null);
    } else {
      setValue(undefined);
    }
  };

  const handleUpload = async () => {
    if (!value) {
      setError('Пожалуйста, выберите файл для загрузки');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', value);
    try {
      const { data } = await $api.post('/users/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setReponse(data);
      setValue(undefined);
    } catch (error) {
      console.error(error);
      setError('Ошибка загрузки файла. Пожалуйста, попробуйте еще раз.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (addMultipleState.isSuccess) {
      toast.success('Пользователи успешно добавлены');
      if (response) {
        const { departments, directions, products } = response;
        const teams = [
          ...(departments || []),
          ...(directions || []),
          ...(products || []),
        ];

        if (teams.length > 0) {
          dispatch(teamsApi.util.invalidateTags(['Team']));
        }
      }
      closeModal();
    }
    if (addMultipleState.isError) {
      toast.error('Ошибка при добавлении пользователей');
    }
  }, [addMultipleState.isSuccess, addMultipleState.isError, closeModal]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={'Загрузить из файла'}
      loading={isLoading}
      footer={false}
      childrenFlex={false}
      className="sm:max-w-2xl max-sm:max-w-full"
    >
      <div className="flex flex-col gap-3 pt-5 pb-3">
        <UploadFile
          hiddenLabel
          onChange={handleChange}
          value={value}
          className="w-full"
          accept=".xlsx"
        />
        {error && <p className="text-red-500">{error}</p>}
        {value && (
          <PrimaryButton
            className="self-center"
            onClick={handleUpload}
            disabled={isLoading}
          >
            Загрузить
          </PrimaryButton>
        )}
      </div>
      {response && (
        <ImportUsersTable
          onSubmit={handleSubmit}
          isLoading={addMultipleState.isLoading}
          setRows={setReponse}
          rows={response.data}
          departments={response.departments}
          products={response.products}
          directions={response.directions}
        />
      )}
    </Modal>
  );
}
