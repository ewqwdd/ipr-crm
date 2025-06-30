import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { usersApi } from './usersApi';
import { DeputyUser, User } from '@/entities/user';

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

const updateUserInCacheCallback = (
  dispatch: Dispatch,
  userId: number,
  update: (u: User) => User,
) => {
  dispatch(
    usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
      const index = draft.users.findIndex((user) => user.id === userId);
      if (index !== -1) {
        draft.users[index] = update(draft.users[index]);
      }
    }),
  );
  dispatch(
    usersApi.util.updateQueryData('getUserById', userId, (draft) => {
      draft = update(draft);
      return draft;
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

const handleRemoveDeputyQuery = async (
  { deputyId, userId }: { deputyId: number; userId: number },
  { dispatch, queryFulfilled }: Options<void>,
) => {
  try {
    await queryFulfilled;
    updateUserInCacheCallback(dispatch, deputyId, (user) => ({
      ...user,
      deputyRelationsAsDeputy: user.deputyRelationsAsDeputy.filter(
        (relation) => relation.user.id !== userId,
      ),
    }));
    updateUserInCacheCallback(dispatch, userId, (user) => ({
      ...user,
      deputyRelationsAsUser: user.deputyRelationsAsUser.filter(
        (relation) => relation.deputy.id !== deputyId,
      ),
    }));
  } catch (error) {
    console.error('Ошибка при удалении заместителя:', error);
  }
};

const handleSetDeputyQuery = async (
  _: unknown,
  {
    dispatch,
    queryFulfilled,
  }: Options<{ user: DeputyUser; deputy: DeputyUser }>,
) => {
  try {
    const { data } = await queryFulfilled;
    updateUserInCacheCallback(dispatch, data.user.id, (user) => ({
      ...user,
      deputyRelationsAsUser: [
        ...user.deputyRelationsAsUser,
        { deputy: data.deputy },
      ],
    }));
    updateUserInCacheCallback(dispatch, data.deputy.id, (user) => ({
      ...user,
      deputyRelationsAsDeputy: [
        ...user.deputyRelationsAsDeputy,
        { user: data.user },
      ],
    }));
  } catch (error) {
    console.error('Ошибка при установке заместителя:', error);
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
  handleRemoveDeputyQuery,
  handleSetDeputyQuery,
};
