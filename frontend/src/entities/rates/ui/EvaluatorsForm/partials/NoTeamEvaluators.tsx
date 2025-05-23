import { usersApi } from '@/shared/api/usersApi';
import EvaluatorTeam from './EvaluatorTeam';
import { useMemo } from 'react';
import { EvaluateUser, EvaulatorType } from '@/entities/rates/types/types';
import { Team } from '@/entities/team';

interface EvaluatorTeamProps {
  excluded?: EvaluateUser[];
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  evaluateTeam?: Team;
  type?: EvaulatorType;
}

export default function NoTeamEvaluators(props: EvaluatorTeamProps) {
  const { data } = usersApi.useGetUsersQuery({});
  const users = useMemo(
    () =>
      data?.users?.filter(
        (u) => u.teams?.length === 0 && u.teamCurator?.length === 0,
      ),
    [data],
  );

  if (!users) return null;

  const renderUsers: Team['users'] =
    users?.map((u) => ({
      user: {
        avatar: u.avatar,
        id: u.id,
        specsOnTeams: u.Spec?.id
          ? [{ specId: u.Spec.id, spec: { name: '' } }]
          : [],
        username: u.username,
      },
    })) ?? [];

  return (
    <EvaluatorTeam
      team={{
        id: -1,
        name: 'Без команды',
        users: renderUsers,
        curatorSpecs: [],
      }}
      {...props}
    />
  );
}
