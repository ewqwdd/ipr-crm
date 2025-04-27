import { AddRateDto, Rate } from '@/entities/rates';
import { EvaluateUser } from '@/entities/rates/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ConfirmDto {
  rateId: number;
  evaluateCurators: EvaluateUser[];
  evaluateTeam: EvaluateUser[];
  evaluateSubbordinate: EvaluateUser[];
  comment?: string;
}

interface RateFiltersDto {
  page?: number;
  limit?: number;
  skill?: 'HARD' | 'SOFT';
  status?: 'COMPLETED' | 'NOT_COMPLETED';
  specId?: number;
  user?: number;
  teams?: number[];
  startDate?: string;
  endDate?: string;
}

const rate360Api = createApi({
  reducerPath: 'rate360Api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: [
    'Rate360',
    'Assigned',
    'Self',
    'ConfirmCurator',
    'ConfirmUser',
    'UserRates',
    'Report',
  ],
  endpoints: (build) => ({
    getRates: build.query<{ data: Rate[]; total: number }, RateFiltersDto>({
      query: (params) => ({
        url: '/rate360',
        params,
      }),
      providesTags: (_, __, { page }) => [{ type: 'Rate360', page }],
    }),
    createRate: build.mutation<
      void,
      {
        rate: AddRateDto[];
        skill: string[];
        confirmCurator: boolean;
        confirmUser: boolean;
        rateType: Rate['rateType'];
      }
    >({
      query: (body) => ({
        url: '/rate360',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Rate360', 'UserRates'],
    }),
    deleteRate: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/rate360/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rate360', 'UserRates'],
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
      keepUnusedDataFor: 60 * 3 * 1000,
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
      invalidatesTags: ['Rate360', 'Assigned', 'Self', 'UserRates'],
    }),
    approveSelf: build.mutation<void, { rateId: number }>({
      query: ({ rateId }) => ({
        url: `/rate360/assesment/approve-self/${rateId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Rate360', 'Assigned', 'Self', 'UserRates', 'Report'],
    }),
    approveAssigned: build.mutation<void, { rateId: number }>({
      query: ({ rateId }) => ({
        url: `/rate360/assesment/approve-assigned/${rateId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Rate360', 'Assigned', 'Self', 'UserRates', 'Report'],
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
      invalidatesTags: ['Rate360', 'ConfirmCurator', 'Assigned', 'UserRates'],
    }),
    confirmRateByUser: build.mutation<void, ConfirmDto>({
      query: (data) => ({
        url: '/rate360/confirm-by-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rate360', 'ConfirmUser', 'Self', 'UserRates'],
    }),
    deleteRates: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/rate360/delete-rates',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: [
        'Rate360',
        'Assigned',
        'Self',
        'ConfirmCurator',
        'ConfirmUser',
        'Report',
      ],
    }),
    findMyRates: build.query<Rate[], void>({
      query: () => '/rate360/me',
      providesTags: ['UserRates'],
    }),
    findReport: build.query<Rate, number>({
      query: (id) => `/rate360/${id}/report`,
      providesTags: (_, __, id) => [{ type: 'Report', id }],
      keepUnusedDataFor: 60 * 5 * 1000,
    }),
    toggleReportVisibility: build.mutation<
      void,
      { ids: number[]; visible: boolean }
    >({
      query: ({ ids, visible }) => ({
        url: '/rate360/report-visibility',
        method: 'POST',
        body: { isVisible: visible, ids },
      }),
      invalidatesTags: ['Rate360', 'UserRates', 'Report'],
    }),
    editEvaluators: build.mutation<
      void,
      {
        rateId: number;
        evaluateCurators: number[];
        evaluateTeam: number[];
        evaluateSubbordinate: number[];
      }
    >({
      query: (data) => ({
        url: `/rate360/${data.rateId}/evaluator`,
        method: 'POST',
        body: {
          evaluateCurators: data.evaluateCurators,
          evaluateTeam: data.evaluateTeam,
          evaluateSubbordinate: data.evaluateSubbordinate,
        },
      }),
      invalidatesTags: ['Rate360', 'Assigned', 'UserRates'],
    }),
  }),
});

export { rate360Api };
