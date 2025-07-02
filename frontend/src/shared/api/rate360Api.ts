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

export interface RateFiltersDto {
  page?: number;
  limit?: number;
  skill?: 'HARD' | 'SOFT';
  status?:
    | 'COMPLETED'
    | 'NOT_COMPLETED'
    | 'NOT_CONFIRMED'
    | 'CONFIRMED'
    | 'CONFIRMED_BY_USER';
  specId?: number;
  user?: number;
  product?: number;
  department?: number;
  direction?: number;
  group?: number;
  startDate?: string;
  endDate?: string;
  hidden?: boolean;
  subbordinatesOnly?: boolean;
  includeWhereEvaluatorCurator?: boolean;
}

const rate360Api = createApi({
  reducerPath: 'rate360Api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: [
    'Rate360',
    'AssignedRate',
    'SelfRate',
    'ConfirmRateCurator',
    'ConfirmRateUser',
    'UserRates',
    'RateReport',
  ],
  endpoints: (build) => ({
    getRates: build.query<{ data: Rate[]; total: number }, RateFiltersDto>({
      query: (params) => ({
        url: '/rate360',
        params,
      }),
      providesTags: (_, __, params) => [{ type: 'Rate360', params }],
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
      providesTags: ['AssignedRate'],
    }),
    selfRates: build.query<Rate[], void>({
      query: () => '/rate360/self-rates',
      providesTags: ['SelfRate'],
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
      invalidatesTags: ['Rate360', 'AssignedRate', 'SelfRate', 'UserRates'],
    }),
    approveSelf: build.mutation<void, { rateId: number }>({
      query: ({ rateId }) => ({
        url: `/rate360/assesment/approve-self/${rateId}`,
        method: 'POST',
      }),
      invalidatesTags: [
        'Rate360',
        'AssignedRate',
        'SelfRate',
        'UserRates',
        'RateReport',
      ],
    }),
    approveAssigned: build.mutation<void, { rateId: number }>({
      query: ({ rateId }) => ({
        url: `/rate360/assesment/approve-assigned/${rateId}`,
        method: 'POST',
      }),
      invalidatesTags: [
        'Rate360',
        'AssignedRate',
        'SelfRate',
        'UserRates',
        'RateReport',
      ],
    }),
    confirmByCurator: build.query<Rate[], void>({
      query: () => '/rate360/confirm-by-curator',
      providesTags: ['ConfirmRateCurator'],
    }),
    confirmByUser: build.query<Rate[], void>({
      query: () => '/rate360/confirm-by-user',
      providesTags: ['ConfirmRateUser'],
    }),
    confirmRateByCurator: build.mutation<void, ConfirmDto>({
      query: (data) => ({
        url: '/rate360/confirm-by-curator',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'Rate360',
        'ConfirmRateCurator',
        'AssignedRate',
        'UserRates',
      ],
    }),
    confirmRateByUser: build.mutation<void, ConfirmDto>({
      query: (data) => ({
        url: '/rate360/confirm-by-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Rate360', 'ConfirmRateUser', 'SelfRate', 'UserRates'],
    }),
    deleteRates: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/rate360/delete-rates',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: [
        'Rate360',
        'AssignedRate',
        'SelfRate',
        'ConfirmRateCurator',
        'ConfirmRateUser',
        'RateReport',
      ],
    }),
    findMyRates: build.query<{ data: Rate[]; total: number }, RateFiltersDto>({
      query: ({ page, limit }) => ({
        url: '/rate360/me',
        params: { page, limit },
      }),
      providesTags: (_, __, params) => [{ type: 'UserRates', params }],
    }),
    findReport: build.query<Rate, number>({
      query: (id) => `/rate360/${id}/report`,
      providesTags: (_, __, id) => [{ type: 'RateReport', id }],
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
      invalidatesTags: ['Rate360', 'UserRates', 'RateReport'],
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
      invalidatesTags: ['Rate360', 'AssignedRate', 'UserRates'],
    }),
    leaveAssigned: build.mutation<void, { rateId: number }>({
      query: ({ rateId }) => ({
        url: `/rate360/assesment/leave-assigned/${rateId}`,
        method: 'POST',
      }),
      invalidatesTags: [
        'Rate360',
        'AssignedRate',
        'SelfRate',
        'UserRates',
        'RateReport',
      ],
    }),
    archiveRates: build.mutation<void, { ids: number[] }>({
      query: ({ ids }) => ({
        url: '/rate360/archive-rates',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Rate360'],
    }),
  }),
});

export { rate360Api };
