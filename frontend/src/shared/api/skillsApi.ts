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
    deleteCompetencyBlock: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/profile-constructor/competency-block/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    deleteCompetency: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/profile-constructor/competency/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    deleteIndicator: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/profile-constructor/indicator/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    editCompetencyBlock: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/profile-constructor/competency-block/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    editCompetency: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/profile-constructor/competency/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    editIndicator: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/profile-constructor/indicator/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    addCompetencyMaterial: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/competency/material`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    addIndicatorMaterial: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/indicator/material`,
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    //     /competency/material/indicator/material
  }),
});

export { skillsApi };
