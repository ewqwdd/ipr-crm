import { usersApi } from '@/shared/api/usersApi';
import EvaluatorTeam from './EvaluatorTeam';
import { useMemo } from 'react';
import { EvaluateUser } from '@/entities/rates/types/types';

interface EvaluatorTeamProps {
  excluded?: EvaluateUser[];
  selected?: EvaluateUser[];
  setSelected: React.Dispatch<React.SetStateAction<EvaluateUser[]>>;
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

  const renderUsers =
    users?.map((u) => ({
      user: {
        avatar: u.avatar,
        id: u.id,
        specsOnTeams: u.Spec?.id ? [{ specId: u.Spec.id }] : [],
        username: u.username,
      },
    })) ?? [];

  return (
    <EvaluatorTeam
      team={{
        id: -1,
        name: 'Без команды',
        users: renderUsers,
      }}
      {...props}
    />
  );
}
