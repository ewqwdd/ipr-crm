import { AddRateDto, ChangeSpecsType } from '@/entities/rates/types/types';
import { Team } from '@/entities/team';
import { Accordion } from '@/shared/ui/Accordion';
import { UsersIcon } from '@heroicons/react/outline';
import UserItem from '../UserItem';
import { ModalStateType } from './TeamList';
import { cva } from '@/shared/lib/cva';

interface TeamListItemProps {
  team: Team;
  selectedSpecs: AddRateDto[];
  onChangeSpecs: (data: ChangeSpecsType | ChangeSpecsType[]) => void;
  setOpen?: (v: ModalStateType) => void;
  nesting?: number;
}

export default function TeamListItem({
  onChangeSpecs,
  selectedSpecs,
  team,
  setOpen,
  nesting = 0,
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
        <div
          className={cva('flex flex-col gap-2 pl-3', {
            'border-l-gray-200  border-l pl-6': nesting > 0,
          })}
        >
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
              curator
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
          <div className="flex flex-col">
            {team.subTeams?.map((subTeam) => (
              <TeamListItem
                nesting={nesting + 1}
                key={subTeam.id}
                onChangeSpecs={onChangeSpecs}
                selectedSpecs={selectedSpecs}
                team={subTeam}
                setOpen={setOpen}
              />
            ))}
          </div>
        </div>
      </Accordion>
    </div>
  );
}
