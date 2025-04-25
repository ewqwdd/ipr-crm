import { AddRateDto } from '@/entities/rates/types/types';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import TeamListItem from './TeamListItem';
import { AddSpecModal } from '@/widgets/AddSpecModal';
import { teamsApi } from '@/shared/api/teamsApi';
import { useEffect, useState } from 'react';
import { SelectOption } from '@/shared/types/SelectType';
import { Team, TeamUser } from '@/entities/team';
import { useAppSelector } from '@/app';
import { useFilteredStructure } from '@/entities/rates/hooks/useFilteredStructure';
import { curatorFiltered } from '@/entities/rates/hooks/curatorFiltered';
import { SpecOnUser } from '@/entities/team/types/types';
import { Checkbox } from '@/shared/ui/Checkbox';

interface TeamListProps {
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  search: string;
  selectedSpecs: AddRateDto[];
  onChangeSpecs: (teamId: number, specId: number, userId: number) => void;
  onDeselectAll: () => void;
}

type SpecElement =
  | {
      teamId: number;
      id: number;
      username: string;
      avatar?: string;
      specsOnTeams?: SpecOnUser[];
    }
  | {
      teamId: number;
      specsOnTeams: SpecOnUser[];
      id?: number | undefined;
      username?: string | undefined;
      avatar?: string;
    };

export interface ModalStateType {
  teamId: number;
  user: TeamUser;
  curator?: boolean;
}

export default function TeamList({
  selectedSpecs,
  specs,
  search,
  teams,
  onChangeSpecs,
  onDeselectAll,
}: TeamListProps) {
  const { data } = teamsApi.useGetTeamsQuery();
  const filteredTeams = useFilteredStructure(data?.structure, data?.list, {
    specs,
    teams,
    search,
  });
  const [mutate, { isLoading: mutateLoading, isSuccess }] =
    teamsApi.useSetTeamSpecsMutation();
  const [open, setOpen] = useState<ModalStateType | undefined>();
  const [spec, setSpec] = useState<SelectOption[]>([]);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (open) {
      setSpec(
        open.user.specsOnTeams?.map((e) => ({
          id: e.specId,
          name: e.spec.name,
        })) ?? [],
      );
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess) {
      setOpen(undefined);
    }
  }, [isSuccess]);

  const teamsToShow =
    user?.role.name === 'admin'
      ? filteredTeams
      : curatorFiltered(user!, filteredTeams);

  const getSpecs = (teams: Team[]): SpecElement[] => {
    const specs = teams.flatMap((team) => [
      ...(team?.users?.map((u) => ({ ...u.user, teamId: team.id })) ?? []),
      { ...team.curator, teamId: team.id, specsOnTeams: team.curatorSpecs },
      ...(team.subTeams
        ?.flatMap((subTeam) => getSpecs([subTeam]))
        .filter((s) => s.specsOnTeams && s.specsOnTeams?.length > 0) ?? []),
    ]);
    return specs;
  };

  const allSpecs = getSpecs(teamsToShow)
    .flatMap((spec) =>
      spec.specsOnTeams?.map((inner) => ({
        userId: spec.id,
        specId: inner.specId,
        teamId: spec.teamId,
      })),
    )
    .filter((s) => !!s);
  const allSelected =
    selectedSpecs.flatMap((s) => s.specs).length === allSpecs.length;

  const onSelectAll = () => {
    if (allSelected) {
      onDeselectAll();
      return;
    }
    allSpecs.forEach((spec) => {
      const findSelected = selectedSpecs
        .find((s) => s.teamId === spec.teamId)
        ?.specs.find(
          (s) => s.specId === spec.specId && s.userId === spec.userId,
        );
      if (!spec.userId || findSelected) return;
      onChangeSpecs(spec.teamId, spec.specId, spec.userId);
    });
  };

  return (
    <>
      <Checkbox
        title="Выбрать все"
        onChange={onSelectAll}
        checked={allSelected}
      />
      {teamsToShow?.map((team) => (
        <TeamListItem
          key={team.id}
          team={team}
          selectedSpecs={selectedSpecs}
          onChangeSpecs={onChangeSpecs}
          setOpen={setOpen}
        />
      ))}
      <AddSpecModal
        loading={mutateLoading}
        value={spec}
        setValue={setSpec}
        setOpen={(v: boolean) => {
          if (!v) {
            setOpen(undefined);
          }
        }}
        open={!!open}
        onSubmit={() =>
          mutate({
            specs: spec.map((e) => e.id),
            teamId: open!.teamId,
            userId: open!.user.id,
            curator: open?.curator,
          })
        }
      />
    </>
  );
}
