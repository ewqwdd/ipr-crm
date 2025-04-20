import { Accordion } from '@/shared/ui/Accordion';
import { Team } from '../../types/types';
import { memo, MouseEvent } from 'react';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/outline';
import { cva } from '@/shared/lib/cva';

interface StructureItemProps {
  team: Team;
  openModal?: (e: MouseEvent, parentId: number) => void;
  openDeleteModal?: (e: MouseEvent, team: Team) => void;
  startEditing?: (team: Team) => void;
  current?: number;
}

export default memo(function StructureItem({
  team,
  openModal,
  startEditing,
  current,
  openDeleteModal,
}: StructureItemProps) {
  const title = (
    <>
      <span className="font-medium text-gray-900 text-lg truncate">
        {team.name}
      </span>
      {openModal && (
        <button className="ml-6" onClick={(e) => openModal(e, team.id)}>
          <PlusCircleIcon className="size-5 text-gray-500" />
        </button>
      )}
      {openDeleteModal && (
        <button
          className="ml-auto mr-4"
          onClick={(e) => openDeleteModal(e, team)}
        >
          <MinusCircleIcon className="ml-auto size-5 text-red-700" />
        </button>
      )}
    </>
  );
  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    startEditing?.(team);
  };

  if (!team.subTeams?.length) {
    return (
      <div
        className={cva(
          'flex p-2 items-center transition-all duration-200 bg-gray-100 hover:bg-gray-200 cursor-pointer pr-4 sm:pr-14',
          {
            'bg-gray-200': current === team.id,
          },
        )}
        onClick={onClick}
      >
        {title}{' '}
      </div>
    );
  }

  return (
    <>
      <div onClick={onClick}>
        <Accordion
          btnClassName={cva(
            'bg-gray-100 hover:bg-gray-200 p-2 pb-3 border-b border-b-gray-300 [&>button]:flex-none cursor-pointer',
            {
              'bg-gray-200': current === team.id,
            },
          )}
          title={<div className="flex items-center flex-1">{title}</div>}
          className="pt-0"
        >
          <div className="pl-3">
            {team.subTeams?.map((child) => (
              <StructureItem
                openDeleteModal={openDeleteModal}
                openModal={openModal}
                current={current}
                startEditing={startEditing}
                key={child.id}
                team={child}
              />
            ))}
          </div>
        </Accordion>
      </div>
    </>
  );
});
