import { AssignedSurvey, Survey, SurveyCreate } from '@/entities/survey';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { dateService } from '../lib/dateService';

const surveyApi = createApi({
  reducerPath: 'surveyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Survey', 'SurveyAssigned', 'SurveyFinished', 'SurveyResult'],
  endpoints: (build) => ({
    getSurveys: build.query<Survey[], void>({
      query: () => '/survey',
      providesTags: ['Survey'],
    }),
    createSurvey: build.mutation<void, SurveyCreate>({
      query: (body) => ({
        url: '/survey',
        method: 'POST',
        body: {
          ...body,
          startDate: body.startDate
            ? dateService.normalizeStartDate(body.startDate)
            : undefined,
          endDate: body.endDate
            ? dateService.normalizeEndDate(body.endDate)
            : undefined,
        },
      }),
      invalidatesTags: ['Survey'],
    }),
    assignUsers: build.mutation<
      void,
      { surveyId: number; userIds: number[]; startDate?: Date }
    >({
      query: ({ surveyId, userIds, startDate }) => ({
        url: `/survey/assigned/${surveyId}`,
        method: 'POST',
        body: {
          userIds,
          startDate: startDate
            ? dateService.normalizeStartDate(startDate)
            : undefined,
        },
      }),
      invalidatesTags: ['SurveyAssigned'],
    }),
    toggleHidden: build.mutation<void, { id: number; hidden: boolean }>({
      query: ({ id, hidden }) => ({
        url: `/survey/${id}/hidden`,
        method: 'PUT',
        body: { hidden },
      }),
      invalidatesTags: ['Survey', 'SurveyAssigned'],
    }),
    surveyDelete: build.mutation<void, number>({
      query: (id) => ({
        url: `/survey/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Survey', 'SurveyAssigned', 'SurveyFinished'],
    }),
    getSurveyAdmin: build.query<Survey, number>({
      query: (id) => `/survey/admin/${id}`,
      providesTags: (_, __, id) => [{ type: 'Survey', id }],
    }),
    updateSurvey: build.mutation<void, SurveyCreate>({
      query: (body) => ({
        url: `/survey/admin/${body.id}`,
        method: 'PUT',
        body: {
          ...body,
          startDate: body.startDate
            ? dateService.normalizeStartDate(body.startDate)
            : undefined,
          endDate: body.endDate
            ? dateService.normalizeEndDate(body.endDate)
            : undefined,
        },
      }),
      invalidatesTags: ['Survey', 'SurveyAssigned', 'SurveyFinished'],
    }),
    getAssignedSurveys: build.query<AssignedSurvey[], void>({
      query: () => '/survey/assigned',
      providesTags: ['SurveyAssigned'],
    }),
    getAssignedSurvey: build.query<AssignedSurvey, number>({
      query: (id) => `/survey/assigned/${id}`,
      providesTags: (_, __, id) => [{ type: 'SurveyAssigned', id }],
    }),
    finishSurvey: build.mutation<void, number>({
      query: (id) => ({
        url: `/survey/assigned/${id}/finish`,
        method: 'POST',
      }),
      invalidatesTags: ['SurveyAssigned', 'SurveyFinished'],
    }),
    getFinishedSurveyForUser: build.query<AssignedSurvey, number>({
      query: (id) => `/survey/finished/${id}`,
      providesTags: (_, __, id) => [{ type: 'SurveyFinished', id }],
    }),
    getFinishedTestsForUser: build.query<AssignedSurvey[], void>({
      query: () => '/survey/finished',
      providesTags: ['SurveyFinished'],
    }),
    getResultById: build.query<Survey, number>({
      query: (id) => `/survey/${id}/result`,
      providesTags: (_, __, id) => [{ type: 'SurveyResult', id }],
    }),
  }),
});

export { surveyApi };
