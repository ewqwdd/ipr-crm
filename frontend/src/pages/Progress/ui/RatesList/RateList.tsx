import { Rate } from '@/entities/rates';
import { teamsApi } from '@/shared/api/teamsApi';
import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import RateItem from '../RateItem/RateItem';

interface RateListProps {
  data?: Rate[];
  isLoading: boolean;
  heading?: string;
}

export default function RateList({ isLoading, data, heading }: RateListProps) {
  const { data: teamData, isLoading: teamsLoading } =
    teamsApi.useGetTeamsQuery();
  const { data: specsData, isLoading: specsLoading } =
    universalApi.useGetSpecsQuery();

  const filtered =
    data?.filter(
      (t) =>
        t.competencyBlocks.flatMap((cb) =>
          cb.competencies.flatMap((cp) => cp.indicators),
        ).length > 0,
    ) ?? [];
  const teamIds = Array.from(new Set(filtered?.map((rate) => rate.teamId)));
  const teams = teamData?.list.filter((team) => teamIds.includes(team.id));

  const noTeam = filtered?.filter((rate) => !rate.teamId);

  return (
    <div
      className={cva('flex flex-col gap-4 p-4', {
        'animate-pulse': isLoading || teamsLoading || specsLoading,
      })}
    >
      <Heading title={heading} />
      {teams?.map((team) => (
        <div key={team.id} className="flex flex-col gap-2">
          <span className="text-violet-600 font-semibold text-lg">
            {team.name}
          </span>
          <div className="flex flex-col bg-gray-50 py-2">
            {filtered
              ?.filter((t) => t.teamId === team.id)
              .map((rate) => (
                <RateItem specs={specsData ?? []} key={rate.id} rate={rate} />
              ))}
          </div>
        </div>
      ))}

      {noTeam.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-violet-600 font-semibold text-lg">
            Без команды
          </span>
          <div className="flex flex-col bg-gray-50 py-2">
            {noTeam.map((rate) => (
              <RateItem specs={specsData ?? []} key={rate.id} rate={rate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
