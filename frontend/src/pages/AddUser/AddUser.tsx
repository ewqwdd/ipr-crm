import { UserForm } from '@/entities/user';
import { UserFormData } from '@/entities/user/types/types';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function AddUser() {
  const [mutate, { isSuccess, isLoading }] = usersApi.useCreateUserMutation();
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
      JSON.stringify(data.teams?.map(({ value }) => value)),
    );
    mutate(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    }
  }, [isSuccess]);

  return <UserForm loading={isLoading} onSubmit={onSubmit} adminEdit />;
}
