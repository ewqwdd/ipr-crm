import { useModal } from '@/app/hooks/useModal';
import { Rate } from '@/entities/rates';
import { teamsApi } from '@/shared/api/teamsApi';
import { universalApi } from '@/shared/api/universalApi';
import { usersApi } from '@/shared/api/usersApi';
import { cva } from '@/shared/lib/cva';
import { Progress } from '@/shared/ui/Progress';
import { SoftButton } from '@/shared/ui/SoftButton';
import { DocumentReportIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import IprButton from './IprButton';
import { SetStateAction } from 'react';
import { Checkbox } from '@/shared/ui/Checkbox';

interface RateRowProps {
  rate: Rate;
  index: number;
  setSelected?: React.Dispatch<SetStateAction<number[]>>;
  selected?: boolean;
  isFetching?: boolean;
}

export default function RateRow({
  rate,
  index,
  setSelected,
  selected,
  isFetching,
}: RateRowProps) {
  const evaluatorsCount = rate.evaluators.length ?? 0;
  const ratesCount = rate.userRates.length ?? 0;
  // const [deleteFn] = rate360Api.useDeleteRateMutation();
  const { data: users, isFetching: usersFetching } = usersApi.useGetUsersQuery(
    {},
  );
  const { data: teams, isFetching: teamsFetching } =
    teamsApi.useGetTeamsQuery();
  const { data: specs, isFetching: specsFetching } =
    universalApi.useGetSpecsQuery();

  const foundUser = users?.users.find((user) => user.id === rate.user.id);
  const foundTeam = teams?.list.find((team) => team.id === rate.team?.id);
  const foundSpec = specs?.find((spec) => spec.id === rate.spec.id);
  const indicators = rate?.competencyBlocks.flatMap((skill) =>
    skill!.competencies.flatMap((comp) => comp.indicators),
  );

  const isLoading =
    usersFetching || teamsFetching || specsFetching || isFetching;
  const { openModal } = useModal();
  const navigate = useNavigate();

  let percent =
    ratesCount / Math.max((evaluatorsCount + 1) * (indicators?.length ?? 1), 1);

  if (indicators?.length === 0) {
    percent = 1;
  }

  if (isLoading) {
    return (
      <tr
        className={cva('animate-pulse bg-gray-100 h-16', {
          'bg-gray-200': index % 2 === 0,
        })}
      >
        <td colSpan={10} className="px-6 py-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </td>
      </tr>
    );
  }
  return (
    <tr
      className={cva({
        'bg-gray-50': index % 2 === 0,
      })}
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 flex gap-2 items-center">
        <Checkbox
          onChange={() => {
            if (!selected) {
              setSelected?.((prev) => [...prev, rate.id]);
            } else {
              setSelected?.((prev) => prev.filter((id) => id !== rate.id));
            }
          }}
          checked={selected}
        />
        <Link
          className="font-medium text-gray-900  hover:text-violet-900 transition-all"
          to={'/users/' + foundUser?.id}
        >
          {foundUser?.username}
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        <Link
          className="font-medium text-violet-500 hover:text-violet-700 transition-all"
          to={'/teams/' + foundTeam?.id}
        >
          {foundTeam?.name}
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {foundSpec?.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {rate.type}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center flex items-center gap-2">
        {Math.floor(percent * 100)}%
        <Progress percent={percent} className="w-full max-w-14" />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        <SoftButton
          className="rounded-full p-1"
          onClick={() =>
            openModal('RATE_STATS', {
              rate,
              spec: foundSpec,
              user: foundUser,
              indicators,
            })
          }
        >
          <DocumentTextIcon className="h-5 w-5" />
        </SoftButton>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        <SoftButton
          className="rounded-full p-1"
          onClick={() => navigate(`/360rate/report/${rate.id}`)}
        >
          <DocumentReportIcon className="h-5 w-5" />
        </SoftButton>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
        {rate.startDate?.slice(0, 10)}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        {percent >= 1 && <IprButton rate={rate} />}
        {/* <button
          onClick={() => deleteFn({ id: rate.id })}
          className="text-indigo-600 hover:text-indigo-900"
          disabled
        >
          Edit<span className="sr-only">, {rate.id}</span>
        </button> */}
      </td>
    </tr>
  );
}
