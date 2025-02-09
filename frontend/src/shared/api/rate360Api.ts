import { AddRateDto, Rate } from '@/entities/rates';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rate360Api = createApi({
  reducerPath: 'rate360Api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Rate360'],
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
  }),
});

export { rate360Api };
