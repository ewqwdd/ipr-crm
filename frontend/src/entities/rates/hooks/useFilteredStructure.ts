import { Team } from '@/entities/team';
import { Option } from '@/shared/types/Option';
import { useMemo } from 'react';
import { MultiValue } from 'react-select';

interface FilteredTeamsProps {
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  search: string;
}

const filterTeam = (
  team: Team,
  specs: MultiValue<Option>,
  search: string,
): Team | null => {
  const specMatch = (specId: number) => specs.find((sp) => sp.value === specId);

  const filteredBySpec =
    specs.length > 0
      ? {
          ...team,
          curator: team.curatorSpecs?.find((s) => specMatch(s.specId))
            ? team.curator
            : undefined,
          curatorSpecs:
            specs.length > 0
              ? team.curatorSpecs?.filter((s) => specMatch(s.specId))
              : team.curatorSpecs,
          users:
            specs.length > 0
              ? team.users
                  ?.filter((u) =>
                    u.user.specsOnTeams?.find((s) => specMatch(s.specId)),
                  )
                  .map((u) => ({
                    user: {
                      ...u.user,
                      specsOnTeams: u.user.specsOnTeams?.filter((s) =>
                        specMatch(s.specId),
                      ),
                    },
                  }))
              : team.users,
        }
      : { ...team };

  const filteredSearch = {
    ...filteredBySpec,
    users: filteredBySpec.users?.filter((u) =>
      u.user.username.toLowerCase().includes(search.toLowerCase()),
    ),
    curator: filteredBySpec.curator?.username
      .toLowerCase()
      .includes(search.toLowerCase())
      ? filteredBySpec.curator
      : undefined,
  };

  const filteredSubTeams = filteredSearch.subTeams
    ?.map((subTeam) => filterTeam(subTeam, specs, search))
    .filter((sub): sub is Team => sub !== null); // TS-гард, чтобы точно был Team

  if (
    (!filteredSubTeams || filteredSubTeams?.length === 0) &&
    !filteredSearch.users?.length &&
    !filteredSearch.curator
  ) {
    return null;
  }

  return {
    ...filteredSearch,
    subTeams: filteredSubTeams,
  } as Team | null;
};

export const useFilteredStructure = (
  teamsToFilter: Team[] = [],
  allTeams: Team[] = [],
  { specs, teams, search }: FilteredTeamsProps,
) => {
  const filtered = useMemo(() => {
    if (!teamsToFilter) return [];
    if (teams.length > 0) {
      return allTeams
        .filter((team) => teams.find((t) => t.value === team.id))
        .map((team) => filterTeam(team, specs, search))
        .filter((team) => team !== null);
    }
    return teamsToFilter
      .map((team) => filterTeam(team, specs, search))
      .filter((team) => team !== null);
  }, [specs, search, teams, teamsToFilter, allTeams]);

  return filtered;
};
