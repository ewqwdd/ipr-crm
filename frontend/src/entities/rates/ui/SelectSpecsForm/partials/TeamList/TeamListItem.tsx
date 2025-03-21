import { AddRateDto } from '@/entities/rates/types/types';
import { Team } from '@/entities/team';
import { Accordion } from '@/shared/ui/Accordion';
import { UsersIcon } from '@heroicons/react/outline';
import UserItem from '../UserItem';
import { ModalStateType } from './TeamList';

interface TeamListItemProps {
  team: Team;
  selectedSpecs: AddRateDto[];
  onChangeSpecs: (teamId: number, specId: number, userId: number) => void;
  setOpen?: (v: ModalStateType) => void;
}

export default function TeamListItem({
  onChangeSpecs,
  selectedSpecs,
  team,
  setOpen,
}: TeamListItemProps) {
  const specs = selectedSpecs.find((s) => s.teamId === team.id)?.specs ?? [];
  return (
    <div key={team.id} className="flex flex-col gap-2">
      <Accordion
        title={
          <>
            <UsersIcon className="size-4" />
            <span>{team.name}</span>
          </>
        }
        defaultOpen
        titleClassName="text-indigo-600 pl-4 flex gap-2 items-center"
      >
        <div className="flex flex-col gap-2 ml-4">
          {team.curator && (
            <UserItem
              user={team.curator}
              selected={specs}
              teamId={team.id}
              setOpen={(v: ModalStateType) =>
                setOpen?.({
                  ...v,
                  curator: true,
                  user: { ...team.curator!, specsOnTeams: team.curatorSpecs },
                })
              }
              onChange={onChangeSpecs}
              curatorSpecs={team.curatorSpecs}
            />
          )}
          {team.users?.map((user) => (
            <UserItem
              user={user.user}
              key={user.user.id}
              selected={specs}
              teamId={team.id}
              setOpen={setOpen}
              onChange={onChangeSpecs}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
}
