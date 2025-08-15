import { Case, CaseCreateDto } from '@/entities/cases';
import {
  CaseCreateRateDto,
  CaseRate,
  CaseRateItemDto,
} from '@/entities/cases/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const caseApi = createApi({
  reducerPath: 'caseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Case', 'CaseRate', 'CaseAssigned', 'CaseRateReport', 'MyRates'],
  endpoints: (build) => ({
    getCases: build.query<Case[], void>({
      query: () => ({
        url: '/case',
        method: 'GET',
      }),
      providesTags: ['Case'],
    }),
    createCase: build.mutation<Case[], CaseCreateDto>({
      query: (data) => ({
        url: '/case',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Case'],
    }),
    deleteCases: build.mutation<Case[], number[]>({
      query: (ids) => ({
        url: '/case',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Case'],
    }),
    editCase: build.mutation<Case[], { id: number; data: CaseCreateDto }>({
      query: ({ id, data }) => ({
        url: `/case/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Case'],
    }),
    getCaseRates: build.query<CaseRate[], void>({
      query: () => ({
        url: '/case/rates',
        method: 'GET',
      }),
      providesTags: ['CaseRate'],
    }),
    createCaseRate: build.mutation<void, CaseCreateRateDto>({
      query: (data) => ({
        url: '/case/rates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CaseRate'],
    }),
    getAssignedCases: build.query<CaseRate[], void>({
      query: () => ({
        url: '/case/rates/assigned',
        method: 'GET',
      }),
      providesTags: ['CaseAssigned'],
    }),
    getAssignedCase: build.query<CaseRate, string>({
      query: (id) => ({
        url: `/case/rates/assigned/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'CaseAssigned', id }],
    }),
    answerAssignedCase: build.mutation<
      void,
      { id: string; rates: CaseRateItemDto[]; globalComment?: string }
    >({
      query: ({ id, rates, globalComment }) => ({
        url: `/case/rates/assigned/${id}/answer`,
        method: 'POST',
        body: { rates, globalComment },
      }),
      invalidatesTags: [
        'CaseAssigned',
        'CaseRateReport',
        'CaseRateReport',
        'CaseRate',
      ],
    }),
    getReport: build.query<CaseRate, string>({
      query: (id) => ({
        url: `/case/rates/report/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'CaseRateReport', id }],
    }),
    getMyCaseRates: build.query<CaseRate[], void>({
      query: () => ({
        url: '/case/my-rates',
        method: 'GET',
      }),
      providesTags: ['MyRates'],
    }),
    setEvaluators: build.mutation<
      void,
      { rateId: number; evaluators: number[] }
    >({
      query: ({ rateId, evaluators }) => ({
        url: '/case/rates/evaluators',
        method: 'POST',
        body: { evaluators, rateId },
      }),
      invalidatesTags: [
        'CaseRate',
        'MyRates',
        'CaseAssigned',
        'CaseRateReport',
        'CaseRateReport',
      ],
    }),
  }),
});

export { caseApi };
