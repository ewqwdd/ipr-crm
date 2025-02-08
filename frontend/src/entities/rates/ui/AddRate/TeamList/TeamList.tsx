import { useAppDispatch } from '@/app';
import { ratesActions } from '@/entities/rates/model/rateSlice';
import { teamsApi } from '@/shared/api/teamsApi';
import { useMemo } from 'react';
import TeamListItem from './TeamListItem';
import { AddRateDto } from '@/entities/rates/types/types';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';

interface TeamListProps {
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  selectedSpecs: AddRateDto[];
}

export default function TeamList({
  selectedSpecs,
  specs,
  teams,
}: TeamListProps) {
  const dispatch = useAppDispatch();
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
  const filteredEmpty = useMemo(
    () =>
      filteredSpecs?.filter(
        (team) => (team.users && team.users?.length > 0) || team.curator,
      ),
    [filteredSpecs],
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

  const onChangeSpecs = (teamId: number, specId: number, userId: number) => {
    dispatch(ratesActions.selectSpec({ teamId, specId, userId }));
  };
  return filteredTeams?.map((team) => (
    <TeamListItem
      key={team.id}
      team={team}
      selectedSpecs={selectedSpecs}
      onChangeSpecs={onChangeSpecs}
    />
  ));
}
