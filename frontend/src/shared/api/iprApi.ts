import { Ipr, TaskPriority, TaskType } from '@/entities/ipr';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AddTaskDto {
  planId: number;
  name: string;
  competencyId?: number;
  indicatorId?: number;
  url?: string;
  deadline: string | null;
  contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';
  priority: TaskPriority;
  taskType: TaskType;
  userId: number;
}

interface IprFiltersDto {
  page?: number;
  limit?: number;
  skill?: 'HARD' | 'SOFT';
  specId?: number;
  user?: number;
  teams?: number[];
  startDate?: string;
  endDate?: string;
}

const iprApi = createApi({
  reducerPath: 'iprApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['ipr', 'board', 'user-ipr'],
  endpoints: (build) => ({
    createIpr: build.mutation<void, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'POST',
      }),
      invalidatesTags: ['ipr', 'user-ipr'],
    }),
    findRate: build.query<Ipr, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'ipr', id }],
    }),
    findBoard: build.query<Ipr['tasks'], void>({
      query: () => ({
        url: '/ipr/task/board',
        method: 'GET',
      }),
      providesTags: ['board'],
    }),
    findBoardForUser: build.query<Ipr['tasks'], number>({
      query: (id) => ({
        url: '/ipr/task/board/' + id,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'board', id }],
    }),
    addTask: build.mutation<void, AddTaskDto>({
      query: (body) => ({
        url: '/ipr/task',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { planId, userId }) => [
        { type: 'ipr', id: planId },
        { type: 'board', id: userId },
        { type: 'user-ipr', id: userId },
      ],
    }),
    deleteTasks: build.mutation<
      void,
      { ids: number[]; userId: number; planId: number }
    >({
      query: ({ ids }) => ({
        url: '/ipr/task',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (_, __, { userId, planId }) => [
        { type: 'ipr', id: planId },
        { type: 'board', id: userId },
        { type: 'user-ipr', id: userId },
      ],
    }),
    addToBoard: build.mutation<
      void,
      { ids: number[]; userId: number; planId: number }
    >({
      query: (data) => ({
        url: '/ipr/task/add-to-board',
        method: 'POST',
        body: { ids: data.ids },
      }),
      invalidatesTags: (_, __, { userId, planId }) => [
        { type: 'ipr', id: planId },
        { type: 'board', id: userId },

        { type: 'user-ipr', id: userId },
      ],
    }),
    transferToObvious: build.mutation<
      void,
      { ids: number[]; userId: number; planId: number }
    >({
      query: (data) => ({
        url: '/ipr/task/transfer-to-obvious',
        method: 'POST',
        body: { ids: data.ids },
      }),
      invalidatesTags: (_, __, { userId, planId }) => [
        { type: 'ipr', id: planId },
        { type: 'board', id: userId },
        { type: 'user-ipr', id: userId },
      ],
    }),
    transferToOther: build.mutation<
      void,
      { ids: number[]; userId: number; planId: number }
    >({
      query: (data) => ({
        url: '/ipr/task/transfer-to-other',
        method: 'POST',
        body: { ids: data.ids },
      }),
      invalidatesTags: (_, __, { userId, planId }) => [
        { type: 'ipr', id: planId },
        { type: 'board', id: userId },
        { type: 'user-ipr', id: userId },
      ],
    }),
    findAllIpr: build.query<{ data: Ipr[]; total: number }, IprFiltersDto>({
      query: ({
        limit,
        page,
        endDate,
        skill,
        specId,
        startDate,
        teams,
        user,
      }) => ({
        url: '/ipr',
        method: 'GET',
        params: {
          limit,
          page,
          endDate,
          skill,
          specId,
          startDate,
          teams: teams?.join(','),
          user,
        },
      }),
      providesTags: (_, __, params) => [{ type: 'ipr', params }],
    }),
    findUserIprById: build.query<Ipr, number>({
      query: (id) => ({
        url: '/ipr/user/' + id,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'user-ipr', id }],
    }),
    findUserIprs: build.query<{ data: Ipr[]; total: number }, IprFiltersDto>({
      query: ({ limit, page }) => ({
        url: '/ipr/user',
        method: 'GET',
        params: { limit, page },
      }),
      providesTags: (_, __, params) => [{ type: 'user-ipr', params }],
    }),
  }),
});

export { iprApi };
