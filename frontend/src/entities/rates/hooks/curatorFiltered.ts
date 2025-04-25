import { Team } from '@/entities/team';
import { User } from '@/entities/user';

export const curatorFiltered = (user: User, teams: Team[] = []) => {
  const filterTeam = (team: Team): Team[] => {
    const isCurator = team.curator?.id === user.id;
    if (isCurator) {
      return [team];
    }
    return (
      team.subTeams
        ?.flatMap((subTeam) => filterTeam(subTeam))
        .filter((t) => t !== null) ?? []
    );
  };

  return teams.flatMap((team) => filterTeam(team));
};
