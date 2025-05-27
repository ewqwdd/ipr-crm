import {
  CreateProductFolderDto,
  UpdateProductFolderDto,
  CreateTeamFolderDto,
  UpdateTeamFolderDto,
  CreateSpecFolderDto,
  UpdateSpecFolderDto,
} from '@/entities/folders';
import {
  ProfileConstructorFolderProduct,
  ProfileConstructorFolderTeam,
  ProfileConstructorFolderSpec,
} from '@/entities/folders'; // Укажите правильные типы для ваших моделей
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const foldersApi = createApi({
  reducerPath: 'foldersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/profile-structure-folder',
    credentials: 'include',
  }),
  tagTypes: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
  endpoints: (build) => ({
    // Product Folders
    getProductFolders: build.query<ProfileConstructorFolderProduct[], void>({
      query: () => '',
      providesTags: ['ProductFolders'],
    }),
    createProductFolder: build.mutation<
      ProfileConstructorFolderProduct,
      CreateProductFolderDto
    >({
      query: (body) => ({
        url: '/product',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProductFolders'],
    }),
    updateProductFolder: build.mutation<
      ProfileConstructorFolderProduct,
      { id: number; dto: UpdateProductFolderDto }
    >({
      query: ({ id, dto }) => ({
        url: `/product/${id}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['ProductFolders'],
    }),
    deleteProductFolder: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductFolders'],
    }),

    // Team Folders
    getTeamFolders: build.query<ProfileConstructorFolderTeam[], void>({
      query: () => '/team',
      providesTags: ['TeamFolders'],
    }),
    createTeamFolder: build.mutation<
      ProfileConstructorFolderTeam,
      CreateTeamFolderDto
    >({
      query: (body) => ({
        url: '/team',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
    }),
    updateTeamFolder: build.mutation<
      ProfileConstructorFolderTeam,
      { id: number; dto: UpdateTeamFolderDto }
    >({
      query: ({ id, dto }) => ({
        url: `/team/${id}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
    }),
    deleteTeamFolder: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/team/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
    }),

    // Spec Folders
    getSpecFolders: build.query<ProfileConstructorFolderSpec[], void>({
      query: () => '/spec',
      providesTags: ['SpecFolders'],
    }),
    createSpecFolder: build.mutation<
      ProfileConstructorFolderSpec,
      CreateSpecFolderDto
    >({
      query: (body) => ({
        url: '/spec',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
    }),
    updateSpecFolder: build.mutation<
      ProfileConstructorFolderSpec,
      { id: number; dto: UpdateSpecFolderDto }
    >({
      query: ({ id, dto }) => ({
        url: `/spec/${id}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
    }),
    deleteSpecFolder: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/spec/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
    }),
    setCompetencyBlocksForSpecFolder: build.mutation<
      void,
      { id: number; competencyBlockIds: number[] }
    >({
      query: ({ id, competencyBlockIds }) => ({
        url: `/spec/${id}/competency-blocks`,
        method: 'POST',
        body: { competencyBlockIds },
      }),
      invalidatesTags: ['ProductFolders', 'TeamFolders', 'SpecFolders'],
    }),
  }),
});

export { foldersApi };
