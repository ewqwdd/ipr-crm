import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../types/query-keys";
import { $api } from "../lib/$api";
import { teamTypes, type Team } from "../types/Team";

export const useGetTeams = () =>
  useQuery<{ structure: Team[]; list: Team[]; teamAccess: number[] }, Error>({
    queryKey: [queryKeys.teams],
    queryFn: async () => {
      const { data } = await $api.get<{
        teams: Team[];
        teamAccess: number[];
      }>("teams");

      const { teams, teamAccess } = data;

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
    staleTime: 1000 * 60 * 15,
  });
