import { teamsApi } from '@/shared/api/teamsApi';
import { usersApi } from '@/shared/api/usersApi';
import { useMemo } from 'react';
import UserFormItem from './UserFormItem';
import { cva } from '@/shared/lib/cva';

interface AddUserFormProps {
  teamId: number;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  curatorId?: number;
}

export default function AddUserForm({
  teamId,
  selected,
  setSelected,
  curatorId,
}: AddUserFormProps) {
  const { data: users, isLoading: usersLoading } = usersApi.useGetUsersQuery(
    {},
  );
  const { data, isLoading: teamsLoading } = teamsApi.useGetTeamsQuery();

  const noTeamUsers = useMemo(
    () =>
      users?.users?.filter(
        (user) => !user.teams?.length && !user.teamCurator?.length,
      ),
    [users],
  );

  const currentTeamUsers = useMemo(
    () =>
      users?.users
        ? [
            ...users?.users
              ?.filter((user) =>
                user.teams?.find(
                  (team) => !!team.teamId && team.teamId === teamId,
                ),
              )
              .map((user) => user.id),
            curatorId,
          ]
        : [],
    [users, teamId],
  );

  const teams = (data?.list ?? []).map((team) => ({
    ...team,
    users: team.users?.filter((u) => !currentTeamUsers?.includes(u.user.id)),
    curator: !currentTeamUsers?.includes(team.curator?.id)
      ? team.curator
      : null,
  }));

  const index = teams.findIndex((team) => team.id === teamId) ?? -1;
  if (teams && index !== -1) {
    delete teams[index];
  }

  return (
    <div
      className={cva('flex flex-col gap-6 mt-4', {
        'animate-pulse': usersLoading || teamsLoading,
      })}
    >
      <div className="flex flex-col gap-2 mt-4">
        <h2>Без команды</h2>
        {noTeamUsers?.map((user) => (
          <UserFormItem
            selected={selected}
            setSelected={setSelected}
            user={user}
            key={user.id}
          />
        ))}
      </div>
      {teams
        .filter((e) => (e.users?.length ?? 0) > 0 || e.curator)
        .map((team) => (
          <div key={team.id} className="flex flex-col gap-2">
            <h2>{team.name}</h2>
            {team?.curator && (
              <UserFormItem
                selected={selected}
                setSelected={setSelected}
                user={users?.users?.find((u) => u.id === team.curator?.id)}
              />
            )}
            {team?.users
              ?.filter(
                (u) =>
                  !currentTeamUsers?.includes(u.user.id) &&
                  curatorId !== u.user.id,
              )
              ?.map((user) => {
                const found = users?.users?.find((u) => u.id === user.user.id);
                return (
                  <UserFormItem
                    selected={selected}
                    setSelected={setSelected}
                    user={found}
                    key={user?.user?.id}
                  />
                );
              })}
          </div>
        ))}
    </div>
  );
}
