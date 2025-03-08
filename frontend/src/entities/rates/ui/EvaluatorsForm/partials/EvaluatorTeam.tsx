import { Team } from '@/entities/team';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import React from 'react';
import Evaluator from './Evaluator';
import { EvaluateUser } from '@/entities/rates/types/types';

interface EvaluatorTeamProps {
  team: Team;
  excluded?: EvaluateUser[];
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
}

export default function EvaluatorTeam({
  excluded = [],
  team,
  setSelected,
  selected = [],
}: EvaluatorTeamProps) {
  const filtered = team.users?.filter(
    (user) => !excluded?.find((e) => e.userId === user.user.id),
  );
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
        {team.curator && (
          <Evaluator
            key={team.curator.id}
            selected={selected}
            setSelected={setSelected}
            user={team.curator}
            curator
          />
        )}
        {filtered?.map((user) => (
          <Evaluator
            key={user.user.id}
            selected={selected}
            setSelected={setSelected}
            user={user.user}
          />
        ))}
      </div>
    </div>
  );
}
