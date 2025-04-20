import { User } from '@/entities/user';
import type { ImportMultipleUser } from '@/entities/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Pagination = { limit?: number; page?: number };

const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (build) => ({
    getUsers: build.query<{ users: User[]; count: number }, Pagination>({
      query: ({ limit, page } = {}) => {
        const queryParams = new URLSearchParams();
        if (page !== undefined) queryParams.append('page', page.toString());
        if (limit !== undefined) queryParams.append('limit', limit.toString());
        return `/users?${queryParams.toString()}`;
      },
      providesTags: ['User'],
    }),
    getUserById: build.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: 'User', id }],
    }),
    updateUser: build.mutation<void, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'User', id }, 'User'],
    }),
    createUser: build.mutation<User, FormData>({
      query: (formData) => ({
        url: '/users',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    editSelf: build.mutation<User, FormData>({
      query: (formData) => ({
        url: '/users/me',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User'],
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
      invalidatesTags: (_, __, id) => [{ type: 'User', id }, 'User'],
    }),
  }),
});

export { usersApi };
