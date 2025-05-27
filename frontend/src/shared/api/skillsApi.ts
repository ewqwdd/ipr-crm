import { Material } from '@/entities/material';
import {
  AddCompetencyBlockDto,
  AddCompetencyDto,
  AddIndicatorDto,
  CompetencyBlock,
  Version,
} from '@/entities/skill';
import { Hints, HintValues } from '@/entities/skill/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const skillsApi = createApi({
  reducerPath: 'skillsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/profile-constructor',
    credentials: 'include',
  }),
  tagTypes: ['Skills', 'Version', 'Versions-history'],
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
    removeCompetencyBlockFromSpec: build.mutation<
      void,
      { id: number; specId: number }
    >({
      query: ({ id, specId }) => ({
        url: `/competency-block/${id}/remove-from-spec/${specId}`,
        method: 'POST',
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
    editCompetency: build.mutation<
      void,
      {
        id: number;
        name: string;
        boundary?: number;
        hints?: Hints;
        values?: HintValues;
      }
    >({
      query: ({ id, name, boundary, hints, values }) => ({
        url: `/competency/${id}`,
        method: 'PUT',
        body: { name, boundary, hints, values },
      }),
      invalidatesTags: ['Skills'],
    }),
    editIndicator: build.mutation<
      void,
      {
        id: number;
        name: string;
        boundary: number;
        hints?: Hints;
        values?: HintValues;
      }
    >({
      query: ({ id, name, boundary, hints, values }) => ({
        url: `/indicator/${id}`,
        method: 'PUT',
        body: { name, boundary, hints, values },
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
    archiveAll: build.mutation<void, void>({
      query: () => ({
        url: '/archive',
        method: 'POST',
      }),
      invalidatesTags: ['Skills', 'Version', 'Versions-history'],
    }),
    getVersion: build.query<Version, void>({
      query: () => '/version',
      transformResponse: (response: { date: string; id: number }) => ({
        date: new Date(response.date),
        id: response.id,
      }),
      providesTags: ['Version'],
    }),
    getVersions: build.query<Version[], void>({
      query: () => '/versions',
      transformResponse: (response: { date: string; id: number }[]) =>
        response.map((version) => ({
          date: new Date(version.date),
          id: version.id,
        })),
      providesTags: ['Versions-history'],
    }),
    getVersionById: build.query<
      { date: Date; blocks: CompetencyBlock[] },
      number
    >({
      query: (id) => `/version/${id}`,
      transformResponse: (response: {
        date: string;
        blocks: CompetencyBlock[];
      }) => ({
        date: new Date(response.date),
        blocks: response.blocks,
      }),
      providesTags: (_, __, id) => [{ type: 'Version', id }],
    }),
    editMultipleBoundaries: build.mutation<
      void,
      { id: number; name: string; boundary: number; hints?: Hints }
    >({
      query: ({ id, name, boundary, hints }) => ({
        url: `/competency/${id}/boundary`,
        method: 'POST',
        body: { name, boundary, hints },
      }),
      invalidatesTags: ['Skills'],
    }),
    restoreArchive: build.mutation<void, { id:number }>({
      query: ({ id }) => ({
        url: `/restore-archive/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Skills', 'Version', 'Versions-history'],
    }),
  }),
});

export { skillsApi };
