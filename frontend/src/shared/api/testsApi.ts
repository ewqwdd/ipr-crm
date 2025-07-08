import { AssignedTest, Test, TestCreate } from '@/entities/test';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { dateService } from '../lib/dateService';

export const testsApi = createApi({
  reducerPath: 'testsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Test', 'TestAssigned', 'TestFinished'],
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
            ? dateService.normalizeStartDate(body.startDate)
            : undefined,
          endDate: body.endDate
            ? dateService.normalizeStartDate(body.endDate)
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
            ? dateService.normalizeStartDate(body.startDate)
            : undefined,
          endDate: body.endDate
            ? dateService.normalizeStartDate(body.endDate)
            : undefined,
        },
      }),
      invalidatesTags: ['Test', 'TestAssigned', 'TestFinished'],
    }),
    getTestAdmin: build.query<Test, number>({
      query: (id) => `/test/admin/${id}`,
      providesTags: (_, __, id) => [{ type: 'Test', id }],
    }),
    getAssignedTests: build.query<AssignedTest[], void>({
      query: () => '/test/assigned',
      providesTags: ['TestAssigned'],
    }),
    getTest: build.query<Test, number>({
      query: (id) => `/test/${id}`,
      providesTags: (_, __, id) => [{ type: 'Test', id }],
    }),
    getAssignedTest: build.query<AssignedTest, number>({
      query: (id) => `/test/assigned/${id}`,
      providesTags: (_, __, id) => [{ type: 'TestAssigned', id }],
      transformResponse: (response: AssignedTest) => {
        if (!response.test.shuffleQuestions) return response;
        const answeredQuestions = response.test.testQuestions.filter((q) =>
          response.answeredQUestions.some((aq) => aq.questionId === q.id),
        );
        const notAnsweredQuestions = response.test.testQuestions.filter(
          (q) =>
            !response.answeredQUestions.some((aq) => aq.questionId === q.id),
        );
        return {
          ...response,
          test: {
            ...response.test,
            testQuestions: [
              ...answeredQuestions,
              ...notAnsweredQuestions.sort(() => Math.random() - 0.5),
            ],
          },
        };
      },
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
            ? dateService.normalizeStartDate(startDate)
            : undefined,
        },
      }),
      invalidatesTags: ['TestAssigned', 'Test'],
    }),
    finishTest: build.mutation<void, number>({
      query: (id) => ({
        url: `/test/assigned/${id}/finish`,
        method: 'POST',
      }),
      invalidatesTags: ['TestFinished', 'TestAssigned', 'Test'],
    }),
    getFinishedTests: build.query<AssignedTest[], void>({
      query: () => '/test/finished',
      providesTags: ['TestFinished'],
    }),
    getFinishedTestForUser: build.query<AssignedTest, number>({
      query: (id) => `/test/finished/${id}`,
      providesTags: (_, __, id) => [{ type: 'TestFinished', id }],
    }),
    toggleHidden: build.mutation<void, { id: number; hidden: boolean }>({
      query: ({ id, hidden }) => ({
        url: `/test/${id}/hidden`,
        method: 'PUT',
        body: { hidden },
      }),
      invalidatesTags: ['Test', 'TestAssigned'],
    }),
    testDelete: build.mutation<void, number>({
      query: (id) => ({
        url: `/test/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Test', 'TestAssigned', 'TestFinished'],
    }),
    testCopy: build.mutation<Test, number>({
      query: (id) => ({
        url: `/test/${id}/copy`,
        method: 'POST',
      }),
      invalidatesTags: ['Test'],
    }),
    removeAssigned: build.mutation<void, { testId: number; userId: number }>({
      query: ({ testId, userId }) => ({
        url: `/test/assigned/${testId}`,
        method: 'DELETE',
        body: {
          userId,
        },
      }),
      invalidatesTags: ['TestAssigned', 'Test'],
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
