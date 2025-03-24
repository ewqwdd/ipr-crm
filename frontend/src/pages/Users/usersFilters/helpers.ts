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

  users.forEach(({ Spec }) => {
    if (Spec && !seen.has(Spec.id)) {
      seen.add(Spec.id);
      options.push({ value: Spec.id, label: Spec.name });
    }
  });

  return options;
};

export const getUserOptions = (users: User[]): Option[] => {
  return users.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));
};

export const getAllFilterOptions = (users: User[]) => ({
  teamsOptions: getTeamOptions(users),
  specsOptions: getSpecOptions(users),
  usersOptions: getUserOptions(users),
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
  return specs.some((spec) => user.Spec && user.Spec.id === spec.value);
};

export const applyUsersFilters = (user: User, filters: Filters): boolean => {
  return (
    filterByTeam(user, filters.teams) &&
    filterByUserId(user, filters.userId) &&
    filterBySpec(user, filters.specs)
  );
};
