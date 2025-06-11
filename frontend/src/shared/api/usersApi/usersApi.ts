import { User } from '@/entities/user';
import type { ImportMultipleUser } from '@/entities/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  handleCreateUserQuery,
  handleEditSelfQuery,
  handleRemoveUserQuery,
  handleUpdateUserQuery,
} from './usersApi.service';

const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    getUsers: build.query<{ users: User[]; count: number }, void>({
      query: () => {
        return '/users';
      },
      providesTags: ['User'],
    }),
    getUserById: build.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: 'User', id }],
    }),
    updateUser: build.mutation<User, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: formData,
      }),
      onQueryStarted: handleUpdateUserQuery,
      invalidatesTags: (_, __, { id }) => [{ type: 'User', id }],
    }),
    createUser: build.mutation<User, FormData>({
      query: (formData) => ({
        url: '/users',
        method: 'POST',
        body: formData,
      }),
      onQueryStarted: handleCreateUserQuery,
      invalidatesTags: ['User'],
    }),
    editSelf: build.mutation<User, FormData>({
      query: (formData) => ({
        url: '/users/me',
        method: 'PUT',
        body: formData,
      }),
      onQueryStarted: handleEditSelfQuery,
    }),
    addMultipleUsers: build.mutation<void, ImportMultipleUser[]>({
      query: (users) => ({
        url: '/users/multiple',
        body: { users },
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    removeUser: build.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: handleRemoveUserQuery,
      invalidatesTags: (_, __, id) => [{ type: 'User', id }],
    }),
  }),
});

export { usersApi };
