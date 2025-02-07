import { UserForm } from '@/entities/user';
import { UserFormData } from '@/entities/user/types/types';
import { usersApi } from '@/shared/api/usersApi';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function UserEdit() {
  const { id } = useParams();
  const { data, isFetching, isLoading } = usersApi.useGetUserByIdQuery(
    Number(id),
  );
  const [mutate, { isSuccess, isLoading: mutateLoading }] =
    usersApi.useUpdateUserMutation();
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

  return (
    <UserForm
      loading={isFetching || isLoading || mutateLoading}
      initData={data}
      onSubmit={onSubmit}
      edit
    />
  );
}
