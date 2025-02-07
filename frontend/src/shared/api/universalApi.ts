import { Role } from '@/entities/user';
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
    getSpecs: build.query<Role[], void>({
      query: () => '/universal/specs',
      providesTags: ['Spec'],
    }),
    createSpec: build.mutation<Role[], string>({
      query: (name) => ({
        url: '/universal/specs',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Spec'],
    }),
  }),
});

export { universalApi };
