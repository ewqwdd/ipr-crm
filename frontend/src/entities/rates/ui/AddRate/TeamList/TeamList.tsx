import { useAppDispatch } from '@/app';
import { ratesActions } from '@/entities/rates/model/rateSlice';
import TeamListItem from './TeamListItem';
import { AddRateDto } from '@/entities/rates/types/types';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import { useFilteredTeams } from '@/entities/rates/hooks/useFilteredTeams';

interface TeamListProps {
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  search: string;
  selectedSpecs: AddRateDto[];
}

export default function TeamList({
  selectedSpecs,
  specs,
  search,
  teams,
}: TeamListProps) {
  const dispatch = useAppDispatch();

  const onChangeSpecs = (teamId: number, specId: number, userId: number) => {
    dispatch(ratesActions.selectSpec({ teamId, specId, userId }));
  };

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
