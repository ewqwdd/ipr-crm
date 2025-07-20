import { User, UsersFilter } from '@/entities/user';
import { Option } from '@/shared/types/Option';

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

export const filterByTeam = (user: User, teams: UsersFilter['teams']) => {
  const isTeamFilters = Object.values(teams).some((team) => !!team);
  if (!isTeamFilters) return true;

  const ids = [
    teams.group,
    teams.direction,
    teams.department,
    teams.product,
  ].filter(Boolean);

  return !!user.teams?.some((userTeam) => userTeam.teamId === ids[0]);
};

export const filterByUserId = (user: User, userId: UsersFilter['user']) => {
  return !userId || user.id === Number(userId);
};

export const filterByAccess = (user: User, access: UsersFilter['access']) => {
  if (access === 'ALL') return true;
  if (access === 'ACTIVE') return !!user.access;
  if (access === 'INACTIVE') return !user.access;
  return true;
};

export const applyUsersFilters = (
  user: User,
  filters: UsersFilter,
): boolean => {
  return (
    filterByTeam(user, filters.teams) &&
    filterByUserId(user, filters.user) &&
    filterByAccess(user, filters.access)
  );
};
