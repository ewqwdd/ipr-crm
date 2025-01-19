import { Role } from '@/entities/user'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const universalApi = createApi({
  reducerPath: 'universalApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: 'include' }),
  tagTypes: ['Role'],
  endpoints: (build) => ({
    getRoles: build.query<Role[], void>({
      query: () => "/universal/roles",
      providesTags: ['Role'],
    }),
  }),
})

export { universalApi }
