import { Team } from '@/entities/team';

export const calculateAverage = (values: number[]): number => {
  if (!values.length) return 0;
  return (
    Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 100) /
    100
  );
};

export const dateFormatter = (date: string | null | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  const options = {
    year: 'numeric' as const,
    month: 'numeric' as const,
    day: 'numeric' as const,
  };
  return d.toLocaleDateString(undefined, options);
};

type TeamUser = {
  teamId: number;
  team: { name: string };
};

type CuratorUser = {
  id: number;
  name: string;
};

type Result = {
  curators: string[];
  members: string[];
};

export const getCuratorsAndMembers = (
  teams: Team[],
  userTeams: TeamUser[],
  currentUserName: string,
): Result => {
  if (!teams || !userTeams || !currentUserName)
    return { curators: [], members: [] };
  const curators: string[] = [];
  const members: string[] = [];
  userTeams.forEach(({ teamId }) => {
    const team = teams.find((team) => team.id === teamId);
    if (team) {
      if (team.curator) {
        curators.push(team.curator.username);
      }
      team.users?.forEach((user) => {
        if (user.user.username !== currentUserName) {
          members.push(user.user.username);
        }
      });
    }
  });
  return {
    curators: [...new Set(curators)],
    members: [...new Set(members)],
  };
};

export const getTeamMembers = (
  teams: Team[],
  teamCurator: CuratorUser[],
): string[] => {
  if (!teams || !teamCurator) return [];
  const teamMembers: string[] = [];
  teamCurator.forEach(({ id }) => {
    const team = teams.find((team) => team.id === id);
    if (team) {
      team.users?.forEach((user) => {
        teamMembers.push(user.user.username);
      });
    }
  });
  return [...new Set(teamMembers)];
};
