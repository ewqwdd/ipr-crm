import { teamsApi } from '@/shared/api/teamsApi';
import { cva } from '@/shared/lib/cva';
import { UsersIcon } from '@heroicons/react/outline';
import { useMemo } from 'react';
import { universalApi } from '@/shared/api/universalApi';
import EvaluatorsItem from './EvaluatorsItem';
import { usersApi } from '@/shared/api/usersApi';
import { TeamItemIds } from '../AddRate/EvaluatorsTab/EvaluatorsTab';
import { EvaluateUser, EvaulatorType } from '../../types/types';

interface TeamItemProps {
  teamId: TeamItemIds;
  onDelete: (data: {
    evaluatorId: number;
    teamId: number;
    specId: number;
    userId: number;
    type: EvaulatorType;
  }) => void;
  onSubmit: (data: {
    evaluators: EvaluateUser[];
    teamId: number;
    specId: number;
    userId: number;
    type: EvaulatorType;
  }) => void;
  onAdd?: () => void;
}

export default function TeamItem({
  teamId,
  onDelete,
  onSubmit,
  onAdd,
}: TeamItemProps) {
  const { data, isFetching } = teamsApi.useGetTeamsQuery();
  const { data: specs, isFetching: specsFetching } =
    universalApi.useGetSpecsQuery();
  const { data: users, isFetching: usersFetching } = usersApi.useGetUsersQuery(
    {},
  );

  const team = useMemo(
    () => data?.list.find((t) => t.id === teamId.teamId),
    [data, teamId.teamId],
  );
  const spec = useMemo(
    () => specs?.find((s) => s.id === teamId.specId),
    [specs, teamId.specId],
  );
  const user = useMemo(
    () => users?.users.find((u) => u.id === teamId.userId),
    [users, teamId.userId],
  );

  if (!team) {
    return null;
  }

  const evaluatorItemProps = {
    userId: teamId.userId,
    specId: teamId.specId,
    teamId: teamId.teamId,
    onDelete,
    onSubmit,
    onAdd,
  };

  return (
    <div
      className={cva('flex flex-col gap-4', {
        'animate-pulse': isFetching || specsFetching || usersFetching,
      })}
    >
      <span className="text-indigo-600 flex gap-2 items-center">
        <UsersIcon className="size-4" />
        <span>{team.name}</span>
      </span>
      <span className="text-gray-800 font-medium">{user?.username}</span>

      <div className="bg-indigo-50 p-1.5 sm:p-3 flex flex-col gap-4">
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">Специализация:</span>
          <span className="text-sm text-gray-800">{spec?.name}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          <EvaluatorsItem
            {...evaluatorItemProps}
            type="CURATOR"
            evaluators={[...teamId.evaluateCurators]}
            title="Руководители"
          />
          <EvaluatorsItem
            {...evaluatorItemProps}
            type="TEAM_MEMBER"
            evaluators={[...teamId.evaluateTeam]}
            title="Коллеги"
          />
          <EvaluatorsItem
            {...evaluatorItemProps}
            type="SUBORDINATE"
            evaluators={[...teamId.evaluateSubbordinate]}
            title="Подчиненые"
          />
        </div>
      </div>
    </div>
  );
}
