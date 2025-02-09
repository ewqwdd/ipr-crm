import { teamsApi } from '@/shared/api/teamsApi';
import { Option } from '@/shared/types/Option';
import { useMemo } from 'react';
import { MultiValue } from 'react-select';

interface FilteredTeamsProps {
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  search: string;
}

export const useFilteredTeams = ({
  specs,
  teams,
  search,
}: FilteredTeamsProps) => {
  const { data } = teamsApi.useGetTeamsQuery();

  const filteredSpecs = useMemo(
    () =>
      specs.length > 0
        ? data?.list?.map((t) => ({
            ...t,
            curator: t.curator?.specsOnTeams?.find((s) =>
              specs.find((sp) => sp.value === s.specId),
            )
              ? t.curator
              : undefined,
            users: t.users?.filter((u) =>
              u.user.specsOnTeams.find((s) =>
                specs.find((sp) => sp.value === s.specId),
              ),
            ),
          }))
        : data?.list,
    [data, specs],
  );

  const filteredSearch = useMemo(
    () =>
      filteredSpecs?.map((team) =>
      ({
        ...team,
        users: team.users?.filter((u) =>
          u.user.username.toLowerCase().includes(search.toLowerCase()),
        ),
        curator: team.curator?.username.toLowerCase().includes(search.toLowerCase())
          ? team.curator
          : undefined,
      })
      ),
    [filteredSpecs, search],
  );

  const filteredEmpty = useMemo(
    () =>
        filteredSearch?.filter(
        (team) => (team.users && team.users?.length > 0) || team.curator,
      ),
    [filteredSearch],
  );
  const filteredTeams = useMemo(
    () =>
      teams.length > 0
        ? filteredEmpty?.filter((team) =>
            teams.find((t) => t.value === team.id),
          )
        : filteredEmpty,
    [teams, filteredEmpty],
  );

  return filteredTeams;
};
