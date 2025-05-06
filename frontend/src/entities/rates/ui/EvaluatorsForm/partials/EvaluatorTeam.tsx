import { Team, TeamUser } from '@/entities/team';
import React from 'react';
import Evaluator from './Evaluator';
import { EvaluateUser, EvaulatorType } from '@/entities/rates/types/types';
import toast from 'react-hot-toast';
import { teamsApi } from '@/shared/api/teamsApi';

interface EvaluatorTeamProps {
  team: Team;
  excluded?: EvaluateUser[];
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  evaluateTeam?: Team;
  type?: EvaulatorType;
}

const OTHER_TEAM_LIMIT = 10;

export default function EvaluatorTeam({
  excluded = [],
  team,
  setSelected,
  selected = [],
  evaluateTeam,
}: EvaluatorTeamProps) {
  const filtered = team.users?.filter(
    (user) => !excluded?.find((e) => e.userId === user.user.id),
  );
  const { data } = teamsApi.useGetTeamsQuery();
  const subTeams = data?.list.filter(
    (t) => t.parentTeamId === evaluateTeam?.id && t.id !== evaluateTeam?.id,
  );
  const parentTeam = data?.list.find(
    (t) => t.id === evaluateTeam?.parentTeamId && t.id !== evaluateTeam?.id,
  );
  const subTeamUsers = subTeams?.flatMap((t) => t.users);
  const subTeamsCurators = subTeams?.map((t) => t.curator);

  // Юзеры с других команд, это не пользователи команды, сабо команд и не куратор родительской команды

  const filterFn = (user: EvaluateUser) =>
    !evaluateTeam?.users?.find((u) => u.user.id === user.userId) &&
    evaluateTeam?.curatorId !== user.userId &&
    !subTeamUsers?.find((u) => u?.user.id === user.userId) &&
    !subTeamsCurators?.find((u) => u?.id === user.userId) &&
    parentTeam?.curatorId !== user.userId;

  const otherTeamCount =
    (excluded?.filter(filterFn)?.length ?? 0) +
    (selected.filter(filterFn)?.length ?? 0);

  const onChange = (user: TeamUser) => {
    if (
      filterFn({ userId: user.id }) &&
      otherTeamCount >= OTHER_TEAM_LIMIT &&
      !selected?.find((e) => e.userId === user.id)
    ) {
      toast.error(
        `Вы можете выбрать только ${OTHER_TEAM_LIMIT} человека из другой команды`,
      );
      return;
    }
    setSelected((prev) =>
      prev?.find((e) => e.userId === user.id)
        ? prev.filter((e) => e.userId !== user.id)
        : [...prev, { userId: user.id, username: user.username }],
    );
  };

  const isCuratorExcluded = excluded?.find(
    (e) => e.userId === team.curator?.id,
  );

  if (filtered?.length === 0 && (!team.curator || isCuratorExcluded)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center px-2">
        <span className="text-gray-800 font-medium">{team.name}</span>
        {/* TODO */}
        {/* <SoftButton size="xs" className="py-0.5">
          Выбрать всех
        </SoftButton>
        <SecondaryButton size="xs" className="py-0.5">
          Снять выбор
        </SecondaryButton> */}
      </div>
      <div className="flex flex-col p-2 bg-violet-50">
        {team.curator && !isCuratorExcluded && (
          <Evaluator
            key={team.curator.id}
            selected={selected}
            onChange={onChange}
            user={team.curator}
            curator
          />
        )}
        {filtered?.map((user) => (
          <Evaluator
            key={user.user.id}
            selected={selected}
            onChange={onChange}
            user={user.user}
          />
        ))}
      </div>
    </div>
  );
}
