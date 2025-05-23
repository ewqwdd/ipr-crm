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
        body: {
          ...body,
          startDate: body.startDate
            ? new Date(
                new Date(body.startDate).setHours(0, 0, 0, 0),
              ).toISOString()
            : undefined,
          endDate: body.endDate
            ? new Date(
                new Date(body.endDate).setHours(23, 59, 59, 999),
              ).toISOString()
            : undefined,
        },
      }),
      invalidatesTags: ['Test'],
    }),
    updateTest: build.mutation<void, TestCreate>({
      query: (body) => ({
        url: `/test/admin/${body.id}`,
        method: 'PUT',
        body: {
          ...body,
          startDate: body.startDate
            ? new Date(
                new Date(body.startDate).setHours(0, 0, 0, 0),
              ).toISOString()
            : undefined,
          endDate: body.endDate
            ? new Date(
                new Date(body.endDate).setHours(23, 59, 59, 999),
              ).toISOString()
            : undefined,
        },
      }),
      invalidatesTags: ['Test', 'Assigned', 'Finished'],
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
        body: {
          userIds,
          startDate: startDate
            ? new Date(new Date(startDate).setHours(0, 0, 0, 0)).toISOString()
            : undefined,
        },
      }),
      invalidatesTags: ['Assigned', 'Test'],
    }),
    finishTest: build.mutation<void, number>({
      query: (id) => ({
        url: `/test/assigned/${id}/finish`,
        method: 'POST',
      }),
      invalidatesTags: ['Finished', 'Assigned', 'Test'],
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
      invalidatesTags: ['Test', 'Assigned', 'Finished'],
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
