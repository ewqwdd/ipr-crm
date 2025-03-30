import { AssignedTest, Test, TestCreate } from '@/entities/test';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const testsApi = createApi({
  reducerPath: 'testsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Test', 'Assigned', 'Finished'],
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
    getAssignedTests: build.query<AssignedTest[], void>({
      query: () => '/test/assigned',
      providesTags: ['Assigned'],
    }),
    getTest: build.query<Test, number>({
      query: (id) => `/test/${id}`,
      providesTags: (_, __, id) => [{ type: 'Test', id }],
    }),
    getAssignedTest: build.query<AssignedTest, number>({
      query: (id) => `/test/assigned/${id}`,
      providesTags: (_, __, id) => [{ type: 'Assigned', id }],
    }),
    assignUsers: build.mutation<
      void,
      { testId: number; userIds: number[]; startDate?: Date }
    >({
      query: ({ testId, userIds, startDate }) => ({
        url: `/test/assigned/${testId}`,
        method: 'POST',
        body: { userIds, startDate },
      }),
      invalidatesTags: ['Assigned'],
    }),
    finishTest: build.mutation<void, number>({
      query: (id) => ({
        url: `/test/assigned/${id}/finish`,
        method: 'POST',
      }),
      invalidatesTags: ['Assigned', 'Finished'],
    }),
    getFinishedTests: build.query<AssignedTest[], void>({
      query: () => '/test/finished',
      providesTags: ['Finished'],
    }),
    getFinishedTestForUser: build.query<AssignedTest, number>({
      query: (id) => `/test/finished/${id}`,
      providesTags: (_, __, id) => [{ type: 'Finished', id }],
    }),
  }),
});

export { testsApi };
