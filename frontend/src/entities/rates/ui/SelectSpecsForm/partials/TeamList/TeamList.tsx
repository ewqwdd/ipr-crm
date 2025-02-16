import { AddRateDto } from '@/entities/rates/types/types';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import TeamListItem from './TeamListItem';
import { useFilteredTeams } from '@/entities/rates/hooks/useFilteredTeams';

interface TeamListProps {
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  search: string;
  selectedSpecs: AddRateDto[];
  onChangeSpecs: (teamId: number, specId: number, userId: number) => void;
}

export default function TeamList({
  selectedSpecs,
  specs,
  search,
  teams,
  onChangeSpecs,
}: TeamListProps) {
  const filteredTeams = useFilteredTeams({ specs, teams, search });

  return filteredTeams?.map((team) => (
    <TeamListItem
      key={team.id}
      team={team}
      selectedSpecs={selectedSpecs}
      onChangeSpecs={onChangeSpecs}
    />
  ));
}
