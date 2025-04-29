import { Team, TeamUser } from '@/entities/team';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import React from 'react';
import Evaluator from './Evaluator';
import { EvaluateUser } from '@/entities/rates/types/types';
import toast from 'react-hot-toast';

interface EvaluatorTeamProps {
  team: Team;
  excluded?: EvaluateUser[];
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  evaluateTeam?: Team;
}

const OTHER_TEAM_LINMIT = 10;

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

  const filterFn = (user: EvaluateUser) =>
    !evaluateTeam?.users?.find((u) => u.user.id === user.userId) &&
    evaluateTeam?.curatorId !== user.userId;

  const otherTeamCount =
    (excluded?.filter(filterFn)?.length ?? 0) +
    (selected.filter(filterFn)?.length ?? 0);

  const onChange = (user: TeamUser) => {
    if (
      filterFn({ userId: user.id }) &&
      otherTeamCount >= OTHER_TEAM_LINMIT &&
      !selected?.find((e) => e.userId === user.id)
    ) {
      toast.error(
        `Вы можете выбрать только ${OTHER_TEAM_LINMIT} человека из другой команды`,
      );
      return;
    }
    setSelected((prev) =>
      prev?.find((e) => e.userId === user.id)
        ? prev.filter((e) => e.userId !== user.id)
        : [...prev, { userId: user.id, username: user.username }],
    );
  };

  if (filtered?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center px-2">
        <span className="text-gray-800 font-medium">{team.name}</span>
        <SoftButton size="xs" className="py-0.5">
          Выбрать всех
        </SoftButton>
        <SecondaryButton size="xs" className="py-0.5">
          Снять выбор
        </SecondaryButton>
      </div>
      <div className="flex flex-col p-2 bg-violet-50">
        {team.curator &&
          !excluded?.find((e) => e.userId === team.curator?.id) && (
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
