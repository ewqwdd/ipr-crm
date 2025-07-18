import { User } from '@/entities/user';
import { Option } from '@/shared/types/Option';
import { Filters } from './constants';

export const getTeamOptions = (users: User[]): Option[] => {
  const seen = new Set<number>();
  const options: Option[] = [];

  users.forEach((user) => {
    user.teams?.forEach(({ teamId, team }) => {
      if (!seen.has(teamId)) {
        seen.add(teamId);
        options.push({ value: teamId, label: team.name });
      }
    });
  });

  return options;
};

export const getSpecOptions = (users: User[]): Option[] => {
  const seen = new Set<number>();
  const options: Option[] = [];

  users.forEach((user) =>
    user.specsOnTeams?.forEach((spec) => {
      if (!seen.has(spec.spec.id)) {
        seen.add(spec.spec.id);
        options.push({ value: spec.spec.id, label: spec.spec.name });
      }
    }),
  );

  return options;
};

export const getAllFilterOptions = (users: User[]) => ({
  teamsOptions: getTeamOptions(users),
  specsOptions: getSpecOptions(users),
});

export const filterByTeam = (user: User, teams: Filters['teams']) => {
  if (teams.length === 0) return true;

  return teams.some((filterTeam) =>
    user.teams?.some((userTeam) => userTeam.teamId === filterTeam.value),
  );
};

export const filterByUserId = (user: User, userId: Filters['userId']) => {
  return userId === 'ALL' || user.id === Number(userId);
};

export const filterBySpec = (user: User, specs: Filters['specs']) => {
  if (specs.length === 0) return true;
  return specs.some((spec) =>
    user.specsOnTeams?.find((s) => s.spec.id === spec.value),
  );
};

export const filterByAccess = (user: User, access: Filters['access']) => {
  if (access === 'ALL') return true;
  if (access === 'ACTIVE') return !!user.access;
  if (access === 'INACTIVE') return !user.access;
  return true;
};

export const applyUsersFilters = (user: User, filters: Filters): boolean => {
  return (
    filterByTeam(user, filters.teams) &&
    filterByUserId(user, filters.userId) &&
    filterBySpec(user, filters.specs) &&
    filterByAccess(user, filters.access)
  );
};
