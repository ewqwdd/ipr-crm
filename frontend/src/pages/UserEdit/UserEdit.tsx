import { UserForm } from '@/entities/user';
import { UserFormData } from '@/entities/user/types/types';
import { usersApi } from '@/shared/api/usersApi';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

export default function UserEdit() {
  const { id } = useParams();
  const { data, isFetching, isLoading, isError } = usersApi.useGetUserByIdQuery(
    Number(id),
  );
  const [
    mutate,
    { isSuccess, isLoading: mutateLoading, isError: mutateError },
  ] = usersApi.useUpdateUserMutation();
  const isAdmin = useIsAdmin();

  const navigate = useNavigate();

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    formData.set(
      'teams',
      JSON.stringify(data.teams?.map(({ value }) => value) ?? []),
    );
    mutate({ id: Number(id), formData });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка получения данных');
    }
  }, [isError]);

  useEffect(() => {
    if (mutateError) {
      toast.error('Ошибка сохранения данных');
    }
  }, [mutateError]);

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      <UserForm
        loading={isFetching || mutateLoading}
        initData={data}
        onSubmit={onSubmit}
        edit
        adminEdit={isAdmin}
      />
    </LoadingOverlay>
  );
}
