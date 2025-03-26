import { Test, TestCreate } from '@/entities/test';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const testsApi = createApi({
  reducerPath: 'testsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Test'],
  endpoints: (build) => ({
    getTests: build.query<Test[], void>({
      query: () => '/test',
      providesTags: ['Test'],
    }),
    createTest: build.mutation<void, TestCreate>({
      query: (body) => ({
        url: '/test',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Test'],
    }),
  }),
});

export { testsApi };
