import { Material } from '@/entities/material';
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
    addCompetencyMaterial: build.mutation<void, Omit<Material, 'id'>>({
      query: (body) => ({
        url: `/competency/material`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    addIndicatorMaterial: build.mutation<void, Omit<Material, 'id'>>({
      query: (body) => ({
        url: `/indicator/material`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    addBlockToSpec: build.mutation<
      void,
      { specId: number; blockIds: number[] }
    >({
      query: ({ specId, blockIds }) => ({
        url: `/add-block-to-spec`,
        method: 'POST',
        body: { specId, blockIds },
      }),
      invalidatesTags: ['Skills'],
    }),
    removeMaterial: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/material/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    editMaterial: build.mutation<void, Material>({
      query: (body) => ({
        url: `/material/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
  }),
});

export { skillsApi };
