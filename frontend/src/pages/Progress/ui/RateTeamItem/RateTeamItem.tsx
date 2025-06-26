import { Rate } from '@/entities/rates';
import { Team } from '@/entities/team';
import RateItem from '../RateItem/RateItem';
import { Spec } from '@/entities/user';

interface RateTeamItemProps {
  rates: Rate[];
  team: Team;
  userId: number;
  specsData: Spec[];
  includeSelfTeam?: boolean;
}

export default function RateTeamItem({
  rates,
  team,
  userId,
  specsData,
  includeSelfTeam,
}: RateTeamItemProps) {
  const filtered = !includeSelfTeam
    ? rates
    : rates?.filter(
        (r) =>
          !r.evaluators?.some(
            (evaluator) =>
              evaluator.userId === userId && evaluator.type === 'CURATOR',
          ),
      );

  if (!filtered || filtered.length === 0) return null;

  return (
    <div key={team.id} className="flex flex-col gap-2">
      <span className="text-violet-600 font-semibold text-lg">{team.name}</span>
      <div className="flex flex-col bg-gray-50 py-2">
        {filtered
          ?.filter((t) => t.teamId === team.id)
          .map((rate) => (
            <RateItem specs={specsData ?? []} key={rate.id} rate={rate} />
          ))}
      </div>
    </div>
  );
}
