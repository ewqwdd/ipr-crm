import { User } from '@/entities/user';
import { usersApi } from '../api/usersApi/usersApi';

export const useFilterUsersByCurator = (
  teamCurator?: User['teamCurator'],
  role?: User['role']['name'],
) => {
  const { data, isFetching } = usersApi.useGetUsersQuery({});

  if (role === 'admin') {
    return { data: data?.users, isFetching: isFetching };
  }

  const ids = teamCurator?.map((curator) => curator.id) ?? [];

  const filteredUsers =
    data?.users.filter(
      (user) => !!user.teams?.find((team) => ids.includes(team.teamId)),
    ) ?? [];

  return { data: filteredUsers, isFetching: isFetching };
};
