import { AddRateDto, ChangeSpecsType } from '@/entities/rates/types/types';
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
  onChangeSpecs: (data: ChangeSpecsType | ChangeSpecsType[]) => void;
  onDeselect: (data: ChangeSpecsType[]) => void;
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
      id: number;
      username?: string | undefined;
      avatar?: string;
    };

export interface ModalStateType {
  teamId: number;
  user: TeamUser;
  curator?: boolean;
}

const areSpecsEqual = (a: ChangeSpecsType, b: ChangeSpecsType): boolean => {
  return (
    a.teamId === b.teamId && a.specId === b.specId && a.userId === b.userId
  );
};

export default function TeamList({
  selectedSpecs,
  specs,
  search,
  teams,
  onChangeSpecs,
  onDeselect,
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
    return specs.filter((s) => !!s.id) as SpecElement[];
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

  const filteredSelected = selectedSpecs
    .flatMap((s) => s.specs.map((spec) => ({ ...spec, teamId: s.teamId })))
    .filter((selected) =>
      allSpecs.find(
        (spec) =>
          selected.teamId &&
          areSpecsEqual(selected as ChangeSpecsType, spec as ChangeSpecsType),
      ),
    );
  const allSelected = filteredSelected.length >= allSpecs.length;

  const onSelectAll = () => {
    if (allSelected) {
      onDeselect(filteredSelected as ChangeSpecsType[]);
      return;
    }
    const changeSpecs = allSpecs.filter((spec) => {
      const findSelected = selectedSpecs
        .find((s) => s.teamId === spec.teamId)
        ?.specs.find(
          (s) => s.specId === spec.specId && s.userId === spec.userId,
        );
      if (!spec.userId || findSelected) return false;
      return true;
    }) as ChangeSpecsType[];
    onChangeSpecs(changeSpecs);
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
