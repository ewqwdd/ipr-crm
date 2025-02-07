import {
  AddCompetencyBlockDto,
  AddCompetencyDto,
  AddIndicatorDto,
  CompetencyBlock,
} from '@/entities/skill';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const skillsApi = createApi({
  reducerPath: 'skillsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Skills'],
  endpoints: (build) => ({
    getSkills: build.query<CompetencyBlock[], void>({
      query: () => '/profile-constructor',
      providesTags: ['Skills'],
    }),
    createCompetencyBlock: build.mutation<void, AddCompetencyBlockDto>({
      query: (body) => ({
        url: '/profile-constructor/competency-block',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    createCompetency: build.mutation<void, AddCompetencyDto>({
      query: (body) => ({
        url: '/profile-constructor/competency',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    createIndicator: build.mutation<void, AddIndicatorDto>({
      query: (body) => ({
        url: '/profile-constructor/indicator',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
  }),
});

export { skillsApi };
