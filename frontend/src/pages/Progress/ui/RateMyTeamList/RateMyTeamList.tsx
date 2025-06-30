import { useAppSelector } from '@/app';
import { Rate } from '@/entities/rates';
import { memo } from 'react';
import RateTeamItem from '../RateTeamItem/RateTeamItem';
import { teamsApi } from '@/shared/api/teamsApi';
import { Team } from '@/entities/team';
import { universalApi } from '@/shared/api/universalApi';

interface RateListProps {
  rates?: Rate[];
  isLoading?: boolean;
}

export default memo(function RateMyTeamList({
  isLoading,
  rates,
}: RateListProps) {
  const user = useAppSelector((state) => state.user.user);
  const { data: teams, isLoading: teamsLoading } = teamsApi.useGetTeamsQuery();
  const { data: specsData, isLoading: specsLoading } =
    universalApi.useGetSpecsQuery();

  const teamsMap = new Map<Team, Rate[]>();
  rates?.forEach((rate) => {
    if (!rates || !rate.teamId) return;
    const team = { id: rate.teamId, name: rate.team?.name };
    const keys = Array.from(teamsMap.keys());
    if (!keys.some((key) => key?.id === team.id)) {
      const foundRates = rates?.filter((r) => r.teamId === team.id);
      const foundTeam = teams?.list.find((t) => t.id === team.id);
      teamsMap.set(foundTeam!, foundRates);
    }
  });

  if (isLoading || teamsLoading || specsLoading)
    return new Array(3).fill(null).map((_, index) => (
      <div
        key={index}
        className="h-[69px] rounded-md px-8 bg-gray-200 flex items-center animate-pulse mb-2"
      >
        <div className="h-4 bg-gray-400/70 rounded w-3/4"></div>
      </div>
    ));

  return Array.from(teamsMap.entries()).map(
    ([team, rates]) =>
      user && (
        <RateTeamItem
          key={team.id}
          rates={rates}
          team={team}
          userId={user.id}
          specsData={specsData ?? []}
        />
      ),
  );
});
