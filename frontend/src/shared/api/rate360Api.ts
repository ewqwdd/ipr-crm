import { Rate } from '@/entities/rates';
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
  }),
});

export { rate360Api };
