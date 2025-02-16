import { AddRateDto, Rate } from '@/entities/rates';
import { EvaluateUser } from '@/entities/rates/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ConfirmDto {
  rateId: number;
  evaluateCurators: EvaluateUser[];
  evaluateTeam: EvaluateUser[];
  evaluateSubbordinate: EvaluateUser[];
}

const rate360Api = createApi({
  reducerPath: 'rate360Api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Rate360', 'Assigned', 'Self', 'ConfirmCurator', 'ConfirmUser'],
  endpoints: (build) => ({
    getRates: build.query<Rate[], void>({
      query: () => '/rate360',
      providesTags: ['Rate360'],
    }),
    createRate: build.mutation<void, { rate: AddRateDto[]; skill: string[] }>({
      query: (body) => ({
        url: '/rate360',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Rate360'],
    }),
    deleteRate: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/rate360/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rate360'],
    }),
    assignedRates: build.query<Rate[], void>({
      query: () => '/rate360/assigned-rates',
      providesTags: ['Assigned'],
    }),
    selfRates: build.query<Rate[], void>({
      query: () => '/rate360/self-rates',
      providesTags: ['Self'],
    }),
    findForUser: build.query<Rate, number>({
      query: (id) => `/rate360/rate/${id}`,
      providesTags: (_, __, id) => [{ type: 'Rate360', id }],
    }),
    assesment: build.mutation<
      void,
      {
        id: number;
        ratings: Record<number, { rate: number; comment?: string }>;
        comments: Record<number, string>;
      }
    >({
      query: (data) => ({
        url: `/rate360/assesment`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rate360', 'Assigned', 'Self'],
    }),
    approveSelf: build.mutation<void, { rateId: number }>({
      query: ({ rateId }) => ({
        url: `/rate360/assesment/approve-self/${rateId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Rate360', 'Assigned', 'Self'],
    }),
    approveAssigned: build.mutation<void, { rateId: number }>({
      query: ({ rateId }) => ({
        url: `/rate360/assesment/approve-assigned/${rateId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Rate360', 'Assigned', 'Self'],
    }),
    confirmByCurator: build.query<Rate[], void>({
      query: () => '/rate360/confirm-by-curator',
      providesTags: ['ConfirmCurator'],
    }),
    confirmByUser: build.query<Rate[], void>({
      query: () => '/rate360/confirm-by-user',
      providesTags: ['ConfirmUser'],
    }),
    confirmRateByCurator: build.mutation<void, ConfirmDto>({
      query: (data) => ({
        url: '/rate360/confirm-by-curator',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rate360', 'ConfirmCurator', 'Assigned'],
    }),
    confirmRateByUser: build.mutation<void, ConfirmDto>({
      query: (data) => ({
        url: '/rate360/confirm-by-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rate360', 'ConfirmUser', 'Self'],
    }),
  }),
});

export { rate360Api };
