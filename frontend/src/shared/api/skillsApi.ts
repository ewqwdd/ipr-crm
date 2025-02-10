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
    baseUrl: import.meta.env.VITE_API_URL + '/profile-constructor',
    credentials: 'include',
  }),
  tagTypes: ['Skills'],
  endpoints: (build) => ({
    getSkills: build.query<CompetencyBlock[], void>({
      query: () => '',
      providesTags: ['Skills'],
    }),
    createCompetencyBlock: build.mutation<void, AddCompetencyBlockDto>({
      query: (body) => ({
        url: '/competency-block',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    createCompetency: build.mutation<void, AddCompetencyDto>({
      query: (body) => ({
        url: '/competency',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    createIndicator: build.mutation<void, AddIndicatorDto>({
      query: (body) => ({
        url: '/indicator',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    deleteCompetencyBlock: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/competency-block/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    deleteCompetency: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/competency/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    deleteIndicator: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/indicator/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    editCompetencyBlock: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/competency-block/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    editCompetency: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/competency/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    editIndicator: build.mutation<void, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `/indicator/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Skills'],
    }),
    addCompetencyMaterial: build.mutation<
      void,
      {
        competencyId: number;
        name: string;
        url: string;
        contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';
        level: number;
      }
    >({
      query: ({ competencyId, name, url, contentType, level }) => ({
        url: `/competency/material`,
        method: 'POST',
        body: { competencyId, name, url, contentType, level },
      }),
      invalidatesTags: ['Skills'],
    }),
    addIndicatorMaterial: build.mutation<
      void,
      {
        indicatorId: number;
        name: string;
        url: string;
        contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';
        level: number;
      }
    >({
      query: ({ indicatorId, name, url, contentType, level }) => ({
        url: `/indicator/material`,
        method: 'POST',
        body: { indicatorId, name, url, contentType, level },
      }),
      invalidatesTags: ['Skills'],
    }),
    addBlockToSpec: build.mutation<void, { specId: number; blockIds: number[] }>({
      query: ({ specId, blockIds }) => ({
        url: `/add-block-to-spec`,
        method: 'POST',
        body: { specId, blockIds },
      }),
      invalidatesTags: ['Skills'],
    }),
  }),
});

export { skillsApi };
