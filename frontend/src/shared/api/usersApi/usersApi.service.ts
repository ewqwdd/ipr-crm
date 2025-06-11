import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { usersApi } from './usersApi';
import { User } from '@/entities/user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dispatch = ThunkDispatch<any, any, UnknownAction>;

type Options<T> = { dispatch: Dispatch; queryFulfilled: Promise<{ data: T }> };

const updateUserInCache = (dispatch: Dispatch, updatedUser: User) => {
  dispatch(
    usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
      const index = draft.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        draft.users[index] = updatedUser;
      }
    }),
  );
};

const addUserToCache = (dispatch: Dispatch, newUser: User) => {
  dispatch(
    usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
      draft.users.push(newUser);
    }),
  );
};

const removeUserFromCache = (dispatch: Dispatch, userId: number) => {
  return dispatch(
    usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
      const index = draft.users.findIndex((user) => user.id === userId);
      if (index !== -1) {
        draft.users.splice(index, 1);
        draft.count -= 1;
      }
    }),
  );
};

const handleUpdateUserQuery = async (
  _: {
    id: number;
    formData: FormData;
  },
  { dispatch, queryFulfilled }: Options<User>,
) => {
  try {
    const { data: updatedUser } = await queryFulfilled;
    updateUserInCache(dispatch, updatedUser);
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
  }
};

const handleCreateUserQuery = async (
  _: FormData,
  { dispatch, queryFulfilled }: Options<User>,
) => {
  try {
    const { data: newUser } = await queryFulfilled;
    addUserToCache(dispatch, newUser);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
  }
};

const handleEditSelfQuery = async (
  _: FormData,
  { dispatch, queryFulfilled }: Options<User>,
) => {
  try {
    const { data: updatedUser } = await queryFulfilled;
    updateUserInCache(dispatch, updatedUser);
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
  }
};

const handleRemoveUserQuery = async (
  id: number,
  { dispatch, queryFulfilled }: Options<void>,
) => {
  const patchResult = removeUserFromCache(dispatch, id);
  try {
    await queryFulfilled;
  } catch (error) {
    patchResult.undo();
    console.error('Failed to remove user:', error);
  }
};

export {
  updateUserInCache,
  addUserToCache,
  removeUserFromCache,
  handleUpdateUserQuery,
  handleCreateUserQuery,
  handleEditSelfQuery,
  handleRemoveUserQuery,
};
