import { Ipr, TaskPriority, TaskType } from '@/entities/ipr';
import { CompetencyBlock } from '@/entities/skill';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AddTaskDto {
  planId: number;
  name: string;
  competencyId?: number;
  indicatorId?: number;
  url?: string;
  deadline: string | null;
  contentType: 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE' | 'TASK';
  priority: TaskPriority;
  taskType: TaskType;
  userId: number;
  addToConstructor?: boolean;
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
  subbordinatesOnly?: boolean;
  deputyOnly?: boolean;
}

const iprApi = createApi({
  reducerPath: 'iprApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Ipr', 'IprBoard', 'UserIpr', 'CompetencyBlocksByIprId'],
  endpoints: (build) => ({
    createIpr: build.mutation<void, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'POST',
      }),
      invalidatesTags: ['Ipr', 'UserIpr'],
    }),
    findRate: build.query<Ipr, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Ipr', id }],
    }),
    findBoard: build.query<Ipr['tasks'], void>({
      query: () => ({
        url: '/ipr/task/board',
        method: 'GET',
      }),
      providesTags: ['IprBoard'],
    }),
    findBoardForUser: build.query<Ipr['tasks'], number>({
      query: (id) => ({
        url: '/ipr/task/board/' + id,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'IprBoard', id }],
    }),
    addTask: build.mutation<void, AddTaskDto>({
      query: (body) => ({
        url: '/ipr/task',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { planId, userId }) => [
        { type: 'Ipr', id: planId },
        { type: 'IprBoard', id: userId },
        { type: 'UserIpr', id: userId },
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
        { type: 'Ipr', id: planId },
        { type: 'IprBoard', id: userId },
        { type: 'UserIpr', id: userId },
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
        { type: 'Ipr', id: planId },
        { type: 'IprBoard', id: userId },

        { type: 'UserIpr', id: userId },
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
        { type: 'Ipr', id: planId },
        { type: 'IprBoard', id: userId },
        { type: 'UserIpr', id: userId },
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
        { type: 'Ipr', id: planId },
        { type: 'IprBoard', id: userId },
        { type: 'UserIpr', id: userId },
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
        subbordinatesOnly,
        deputyOnly,
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
          subbordinatesOnly,
          deputyOnly,
        },
      }),
      providesTags: (_, __, params) => [{ type: 'Ipr', params }],
    }),
    findUserIprById: build.query<Ipr, number>({
      query: (id) => ({
        url: '/ipr/user/' + id,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'UserIpr', id }],
    }),
    findUserIprs: build.query<{ data: Ipr[]; total: number }, IprFiltersDto>({
      query: ({ limit, page }) => ({
        url: '/ipr/user',
        method: 'GET',
        params: { limit, page },
      }),
      providesTags: (_, __, params) => [{ type: 'UserIpr', params }],
    }),
    findCompetencyBlocksByIprId: build.query<CompetencyBlock[], number>({
      query: (id) => ({
        url: `/ipr/${id}/competency-blocks`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'CompetencyBlocksByIprId', id }],
    }),
    deleteIprs: build.mutation<void, { ids: number[] }>({
      query: (data) => ({
        url: '/ipr',
        method: 'DELETE',
        body: { ids: data.ids },
      }),
      // @ts-ignore
      invalidatesTags: (_, __, { ids }) => [
        'Ipr',
        'UserIpr',
        ...ids.map((id) => ({ type: 'IprBoard', id })),
      ],
    }),
  }),
});

export { iprApi };
