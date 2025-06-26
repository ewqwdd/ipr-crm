import { CreateTeamDto, Team, TeamSingle, teamTypes } from '@/entities/team';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
  }),
  tagTypes: ['Team'],
  endpoints: (build) => ({
    getTeams: build.query<
      { structure: Team[]; list: Team[]; teamAccess: number[] },
      void
    >({
      query: () => '/teams',
      providesTags: ['Team'],
      transformResponse: ({
        teamAccess,
        teams,
      }: {
        teams: Team[];
        teamAccess: number[];
      }) => {
        const noParent = teams
          .filter((team) => !team.parentTeamId)
          .map((t) => ({ ...t, type: teamTypes[0] }));
        const findChildren = (team: Team, index: number) => {
          team.subTeams = teams
            .filter((t) => t.parentTeamId === team.id)
            .map((t) => ({ ...t, type: teamTypes[index] }));
          team.subTeams.forEach((t) => findChildren(t, index + 1));
        };
        noParent.forEach((t) => findChildren(t, 1));
        return { structure: noParent, list: teams, teamAccess };
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
    addCurator: build.mutation<null, { id: number; curatorId: number }>({
      query: ({ id, curatorId }) => ({
        url: `/teams/curators/${id}`,
        method: 'POST',
        body: { curatorId },
      }),
      invalidatesTags: ['Team'],
    }),
    getTeam: build.query<TeamSingle, number>({
      providesTags: (_, __, id) => [{ type: 'Team', id }],
      query: (id) => `/teams/${id}`,
    }),
    setTeamSpecs: build.mutation<
      Team,
      { teamId: number; userId: number; specs: number[]; curator?: boolean }
    >({
      query: (body) => ({
        url: '/teams/specs',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data: newTeam } = await queryFulfilled;
          const filtered = {
            ...newTeam,
            users: newTeam.users?.map((user) => ({
              user: {
                ...user.user,
                specsOnTeams: user.user.specsOnTeams?.filter(
                  (t) => t.teamId === newTeam.id,
                ),
              },
            })),
          } as Team;

          dispatch(
            teamsApi.util.updateQueryData('getTeams', undefined, (draft) => {
              // Обновляем list
              const index = draft.list.findIndex(
                (team) => team.id === filtered.id,
              );
              if (index !== -1) {
                draft.list[index] = filtered;
              }

              // Обновляем structure (рекурсивно)
              const updateInTree = (teams: Team[]) => {
                for (const team of teams) {
                  if (team.id === filtered.id) {
                    Object.assign(team, filtered);
                  }
                  if (team.subTeams) {
                    updateInTree(team.subTeams);
                  }
                }
              };
              updateInTree(draft.structure);
            }),
          );
        } catch (error) {
          console.error('Error updating team:', error);
        }
      },
    }),
    addUsers: build.mutation<null, { userIds: number[]; teamId: number }>({
      query: (body) => ({
        url: '/teams/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    removeUser: build.mutation<null, { teamId: number; userId: number }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export { teamsApi };
