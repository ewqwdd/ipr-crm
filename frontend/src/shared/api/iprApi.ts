import { Ipr } from '@/entities/ipr';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const iprApi = createApi({
  reducerPath: 'iprApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['ipr'],
  endpoints: (build) => ({
    createIpr: build.mutation<void, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'POST',
      }),
      invalidatesTags: ['ipr'],
    }),
    findRate: build.query<Ipr, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'GET',
      }),
      providesTags: ['ipr'],
    }),
  }),
});

export { iprApi };
