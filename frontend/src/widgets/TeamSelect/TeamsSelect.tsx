import { teamsApi } from '@/shared/api/teamsApi';
import { SearchSelect } from '@/shared/ui/SearchSelect';

interface TeamsSelectProps {
  team?: number;
  setTeam: (team?: { id: number; name: string }) => void;
  disabledTeams?: number[];
  enabledTeams?: number[];
  label?: string;
  clearText?: string;
}

export default function TeamsSelect({
  setTeam,
  label,
  team,
  clearText = 'Все',
  disabledTeams = [],
  enabledTeams,
}: TeamsSelectProps) {
  const { data, isLoading } = teamsApi.useGetTeamsQuery();

  const options = enabledTeams
    ? (data?.list
        ?.filter((e) => enabledTeams?.includes(e.id))
        ?.filter((e) => !disabledTeams?.includes(e.id))
        .map((team) => ({
          id: team.id,
          name: team.name,
        })) ?? [])
    : (data?.list
        ?.filter((e) => !disabledTeams?.includes(e.id))
        .map((team) => ({
          id: team.id,
          name: team.name,
        })) ?? []);

  return (
    <SearchSelect
      label={label}
      value={team ?? -1}
      loading={isLoading}
      options={[{ id: -1, name: clearText }, ...options]}
      onChange={(v) => {
        if (v.id === -1) {
          setTeam(undefined);
          return;
        }
        setTeam({ id: Number(v.id), name: v.name });
      }}
    />
  );
}
