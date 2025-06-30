import { usersApi } from '@/shared/api/usersApi/usersApi';
import EvaluatorTeam from './EvaluatorTeam';
import { useMemo } from 'react';
import { EvaluateUser, EvaulatorType } from '@/entities/rates/types/types';
import { Team } from '@/entities/team';
import { generalService } from '@/shared/lib/generalService';

interface EvaluatorTeamProps {
  excluded?: EvaluateUser[];
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
  evaluateTeam?: Team;
  type?: EvaulatorType;
  search?: string;
}

export default function NoTeamEvaluators({
  search = '',
  ...props
}: EvaluatorTeamProps) {
  const { data } = usersApi.useGetUsersQuery();
  const users = useMemo(
    () =>
      data?.users?.filter(
        (u) => u.teams?.length === 0 && u.teamCurator?.length === 0,
      ),
    [data],
  );

  if (!users) return null;

  const renderUsers: Team['users'] =
    users
      ?.filter((u) => u.username.toLocaleLowerCase().includes(search))
      .map((u) => ({
        user: {
          avatar: generalService.transformFileUrl(u.avatar),
          id: u.id,
          specsOnTeams: u.Spec?.id
            ? [{ specId: u.Spec.id, spec: { name: '' } }]
            : [],
          username: u.username,
          deputyRelationsAsDeputy: u.deputyRelationsAsDeputy
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
