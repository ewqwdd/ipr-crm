import { Team } from '@/entities/team';
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

export const filterByTeam = (
  user: User,
  teams: UsersFilter['teams'],
  structure: Team[],
) => {
  const isTeamFilters = Object.values(teams).some((team) => !!team);
  if (!isTeamFilters) return true;

  if (teams.group) {
    return user.teams?.some((userTeam) => userTeam.team.name === teams.group);
  }
  const products = structure.filter(
    (team) => !teams.product || team.name === teams.product,
  );
  const departments = products
    .flatMap((team) => team.subTeams ?? [])
    .filter((team) => !teams.department || team.name === teams.department);
  const directions = departments
    .flatMap((team) => team.subTeams ?? [])
    .filter((team) => !teams.direction || team.name === teams.direction);
  const groups = directions
    .flatMap((team) => team.subTeams ?? [])
    .filter((team) => !teams.group || team.name === teams.group);

  const keys = ['group', 'direction', 'department', 'product'] as const;
  const firstNotNull = keys.findIndex((key) => !!teams[key]);

  const sliced = keys.slice(0, firstNotNull);
  const allowedIds = sliced.reduce((acc, curr) => {
    switch (curr) {
      case 'group':
        return [...acc, ...groups.map((team) => team.id)];
      case 'direction':
        return [...acc, ...directions.map((team) => team.id)];
      case 'department':
        return [...acc, ...departments.map((team) => team.id)];
      case 'product':
        return [...acc, ...products.map((team) => team.id)];
    }
  }, [] as number[]);

  return (
    user.teams?.some((userTeam) =>
      allowedIds.some((id) => id === userTeam.teamId),
    ) ||
    user.teamCurator?.some((userTeam) =>
      allowedIds.some((id) => userTeam.id === id),
    )
  );
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
  structure: Team[],
): boolean => {
  return (
    !!filterByTeam(user, filters.teams, structure) &&
    filterByUserId(user, filters.user) &&
    filterByAccess(user, filters.access)
  );
};
