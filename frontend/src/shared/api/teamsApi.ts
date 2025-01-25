import { CreateTeamDto, Team } from '@/entities/team'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: 'include' }),
  tagTypes: ['Team'],
  endpoints: (build) => ({
    getTeams: build.query<{ structure: Team[]; list: Team[] }, void>({
      query: () => '/teams',
      providesTags: ['Team'],
      transformResponse: (response: Team[]) => {
        const noParent = response.filter((team) => !team.parentTeamId)
        const findChildren = (team: Team) => {
          team.subTeams = response.filter((t) => t.parentTeamId === team.id)
          team.subTeams.forEach(findChildren)
        }
        noParent.forEach(findChildren)
        return { structure: noParent, list: response }
      },
    }),
    createTeam: build.mutation<Team[], CreateTeamDto>({
      query: (team) => ({
        url: '/teams',
        method: 'POST',
        body: team,
      }),
      invalidatesTags: ['Team'],
    }),
    updateTeam: build.mutation<Team[], { id: number; team: CreateTeamDto }>({
      query: ({ id, team }) => ({
        url: `/teams/${id}`,
        method: 'POST',
        body: team,
      }),
      invalidatesTags: ['Team'],
    }),
    removeTeam: build.mutation<null, number>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    leaveTeam: build.mutation<null, { teamId: number; userId: number }>({
      query: (body) => ({
        url: '/teams/leave',
        method: 'post',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    removeCurator: build.mutation<null, number>({
      query: (id) => ({
        url: `/teams/curators/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
})

export { teamsApi }
