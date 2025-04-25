import { teamsApi } from '@/shared/api/teamsApi';
import { SearchSelect } from '@/shared/ui/SearchSelect';

interface TeamsSelectProps {
  team?: number;
  setTeam: (team: { id: number; name: string }) => void;
  disabledTeams?: number[];
  label?: string;
}

export default function TeamsSelect({
  setTeam,
  label,
  team,
  disabledTeams = [],
}: TeamsSelectProps) {
  const { data, isLoading } = teamsApi.useGetTeamsQuery();

  const options =
    data?.list
      ?.filter((e) => !disabledTeams?.includes(e.id))
      .map((team) => ({
        id: team.id,
        name: team.name,
      })) ?? [];

  return (
    <SearchSelect
      label={label}
      options={options}
      value={team}
      loading={isLoading}
      onChange={(v) => setTeam(v)}
    />
  );
}
