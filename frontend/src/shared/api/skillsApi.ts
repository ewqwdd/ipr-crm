import { Rate } from '@/entities/rates'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const skillsApi = createApi({
  reducerPath: 'skillsApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: 'include' }),
  tagTypes: ['Skills'],
  endpoints: (build) => ({
    getSkills: build.query<Rate[], void>({
      query: () => '/profile-constructor',
      providesTags: ['Skills'],
    })
  }),
})

export { skillsApi }
