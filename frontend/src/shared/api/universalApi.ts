import { Role, Spec } from '@/entities/user';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const universalApi = createApi({
  reducerPath: 'universalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Role', 'Spec'],
  endpoints: (build) => ({
    getRoles: build.query<Role[], void>({
      query: () => '/universal/roles',
      providesTags: ['Role'],
    }),
    getSpecs: build.query<Spec[], void>({
      query: () => '/universal/specs',
      providesTags: ['Spec'],
    }),
    createSpec: build.mutation<Spec[], string>({
      query: (name) => ({
        url: '/universal/specs',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Spec'],
    }),
    editSpec: build.mutation<Spec[], { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/universal/specs/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Spec'],
    }),
    deleteSpec: build.mutation<Spec[], number>({
      query: (id) => ({
        url: `/universal/specs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Spec'],
    }),
  }),
});

export { universalApi };
