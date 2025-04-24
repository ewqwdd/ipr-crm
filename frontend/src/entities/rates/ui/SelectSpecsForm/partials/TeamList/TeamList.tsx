import { AddRateDto } from '@/entities/rates/types/types';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import TeamListItem from './TeamListItem';
import { useFilteredTeams } from '@/entities/rates/hooks/useFilteredTeams';
import { AddSpecModal } from '@/widgets/AddSpecModal';
import { teamsApi } from '@/shared/api/teamsApi';
import { useEffect, useState } from 'react';
import { SelectOption } from '@/shared/types/SelectType';
import { TeamUser } from '@/entities/team';
import { useAppSelector } from '@/app';

interface TeamListProps {
  teams: MultiValue<Option>;
  specs: MultiValue<Option>;
  search: string;
  selectedSpecs: AddRateDto[];
  onChangeSpecs: (teamId: number, specId: number, userId: number) => void;
}

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
}: TeamListProps) {
  const filteredTeams = useFilteredTeams({ specs, teams, search });
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
      : filteredTeams?.filter((team) =>
          user?.teamCurator?.find((t) => t.id === team.id),
        );

  const allSpecs = teamsToShow
    ?.flatMap((team) => [
      ...(team?.users?.map((u) => ({ ...u.user, teamId: team.id })) ?? []),
      { ...team.curator, teamId: team.id, specsOnTeams: team.curatorSpecs },
    ])
    .filter((u) => u?.specsOnTeams && u?.specsOnTeams?.length > 0);
  console.log(allSpecs);

  return (
    <>
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
