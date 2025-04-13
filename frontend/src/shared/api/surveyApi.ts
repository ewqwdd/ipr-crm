import { Survey, SurveyCreate } from '@/entities/survey';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const surveyApi = createApi({
  reducerPath: 'surveyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Survey', 'Assigned', 'Finished'],
  endpoints: (build) => ({
    getSurveys: build.query<Survey[], void>({
      query: () => '/survey',
      providesTags: ['Survey'],
    }),
    createSurvey: build.mutation<void, SurveyCreate>({
      query: (body) => ({
        url: '/survey',
        method: 'POST',
        body,
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
        body: { userIds, startDate },
      }),
      invalidatesTags: ['Assigned'],
    }),
    toggleHidden: build.mutation<void, { id: number; hidden: boolean }>({
      query: ({ id, hidden }) => ({
        url: `/survey/${id}/hidden`,
        method: 'PUT',
        body: { hidden },
      }),
      invalidatesTags: ['Survey', 'Assigned'],
    }),
    surveyDelete: build.mutation<void, number>({
      query: (id) => ({
        url: `/survey/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Survey', 'Assigned', 'Finished'],
    }),
    getSurveyAdmin: build.query<Survey, number>({
      query: (id) => `/survey/admin/${id}`,
      providesTags: (_, __, id) => [{ type: 'Survey', id }],
    }),
    updateSurvey: build.mutation<void, SurveyCreate>({
      query: (body) => ({
        url: `/survey/admin/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Survey', 'Assigned', 'Finished'],
    }),
  }),
});

export { surveyApi };
