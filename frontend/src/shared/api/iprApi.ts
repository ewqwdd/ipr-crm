import { Ipr, TaskPriority, TaskStatus } from '@/entities/ipr';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const iprApi = createApi({
  reducerPath: 'iprApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['ipr', 'board'],
  endpoints: (build) => ({
    createIpr: build.mutation<void, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'POST',
      }),
      invalidatesTags: ['ipr'],
    }),
    findRate: build.query<Ipr, number>({
      query: (id) => ({
        url: '/ipr/360/' + id,
        method: 'GET',
      }),
      providesTags: ['ipr'],
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
    // TODO: to check
    changeTaskStatus: build.mutation<void, { id: number; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: '/task/status',
        method: 'POST',
        body: { id, status },
      }),
    }),
    changeTaskPriority: build.mutation<
      void,
      { id: number; priority: TaskPriority }
    >({
      query: ({ id, priority }) => ({
        url: `/${id}/priority`,
        method: 'POST',
        body: { priority },
      }),
    }),
    deleteTask: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/task',
        method: 'DELETE',
        body: { ids },
      }),
    }),
    transferToGeneral: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/task/transfer-to-general',
        method: 'POST',
        body: { ids },
      }),
    }),
    transferToOther: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/task/transfer-to-other',
        method: 'POST',
        body: { ids },
      }),
    }),
    transferToObvious: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/task/transfer-to-obvious',
        method: 'POST',
        body: { ids },
      }),
    }),
    addToBoard: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/task/add-to-board',
        method: 'POST',
        body: { ids },
      }),
    }),
  }),
});

export { iprApi };
