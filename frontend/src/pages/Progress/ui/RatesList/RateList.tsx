import { Rate } from '@/entities/rates';
import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import RateItem from '../RateItem/RateItem';
import { useAppSelector } from '@/app';
import { RateMyTeamList } from '../RateMyTeamList';

interface RateListProps {
  data?: Rate[];
  isLoading: boolean;
  heading?: string;
  includeSelfTeam?: boolean;
  includeOtherTeam?: boolean;
  includeSelfRates?: boolean;
}

export default function RateList({
  isLoading,
  data,
  heading,
  includeSelfTeam,
  includeSelfRates,
  includeOtherTeam,
}: RateListProps) {
  const { data: specsData, isLoading: specsLoading } =
    universalApi.useGetSpecsQuery();
  const user = useAppSelector((state) => state.user.user);

  const filtered =
    data?.filter(
      (t) =>
        t.competencyBlocks.flatMap((cb) =>
          cb.competencies.flatMap((cp) => cp.indicators),
        ).length > 0,
    ) ?? [];

  const noTeam = filtered?.filter((rate) => !rate.teamId);

  const selfTeam = data?.filter(
    (rate) =>
      user?.teams?.find((team) => team.teamId === rate.teamId) ||
      user?.teamCurator?.find((t) => rate.teamId === t.id) ||
      rate.evaluators.some(
        (evaluator) =>
          evaluator.userId === user?.id && evaluator.type === 'CURATOR',
      ),
  );

  const otherTeamRates = data?.filter(
    (rate) =>
      !user?.teams?.some((team) => team.teamId === rate.teamId) &&
      !user?.teamCurator?.some((team) => team.id === rate.teamId) &&
      !rate.evaluators.some(
        (evaluator) =>
          evaluator.userId === user?.id && evaluator.type === 'CURATOR',
      ),
  );

  return (
    <div
      className={cva('flex flex-col gap-4 p-4', {
        'animate-pulse': isLoading || specsLoading,
      })}
    >
      <Heading title={heading} />
      {includeSelfTeam && selfTeam && selfTeam?.length > 0 && (
        <>
          <span className="text-gray-700 font-semibold text-lg mt-4">
            Моя команда
          </span>
          <div className="flex flex-col bg-gray-50 py-2">
            {selfTeam?.map((rate) => (
              <RateItem specs={specsData ?? []} key={rate.id} rate={rate} />
            ))}
          </div>
          <span className="text-gray-700 font-semibold text-lg mt-8">
            По другим пользователям
          </span>
        </>
      )}
      {includeOtherTeam && (
        <RateMyTeamList isLoading={isLoading} rates={otherTeamRates} />
      )}
      {includeSelfRates && (
        <RateMyTeamList isLoading={isLoading} rates={data} />
      )}
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
