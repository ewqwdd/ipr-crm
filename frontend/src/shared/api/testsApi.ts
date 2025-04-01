import { AssignedTest, Test, TestCreate } from '@/entities/test';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const testsApi = createApi({
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
    updateTest: build.mutation<void, TestCreate>({
      query: (body) => ({
        url: `/test/admin/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Test', 'Assigned'],
    }),
    getTestAdmin: build.query<Test, number>({
      query: (id) => `/test/admin/${id}`,
      providesTags: (_, __, id) => [{ type: 'Test', id }],
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
    toggleHidden: build.mutation<void, { id: number; hidden: boolean }>({
      query: ({ id, hidden }) => ({
        url: `/test/${id}/hidden`,
        method: 'PUT',
        body: { hidden },
      }),
      invalidatesTags: ['Test', 'Assigned'],
    }),
    testDelete: build.mutation<void, number>({
      query: (id) => ({
        url: `/test/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Test', 'Assigned'],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useCreateTestMutation,
  useGetAssignedTestsQuery,
  useGetTestQuery,
  useGetAssignedTestQuery,
  useAssignUsersMutation,
  useFinishTestMutation,
  useGetFinishedTestsQuery,
} = testsApi;
