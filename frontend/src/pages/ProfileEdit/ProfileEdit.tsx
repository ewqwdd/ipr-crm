import { useAppDispatch, useAppSelector } from '@/app';
import { userActions, UserForm } from '@/entities/user';
import { UserFormData } from '@/entities/user/types/types';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function ProfileEdit() {
  const user = useAppSelector((state) => state.user.user);
  const [mutate, { isSuccess, isLoading: mutateLoading, isError, data }] =
    usersApi.useEditSelfMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
    mutate(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка сохранения данных');
    }
  }, [isError]);

  useEffect(() => {
    if (data) {
      dispatch(userActions.setUser(data));
    }
  }, [data]);

  return (
    <UserForm
      loading={mutateLoading}
      initData={user ?? undefined}
      onSubmit={onSubmit}
      edit
    />
  );
}
