import { AddTeamModal, StructureItem, Team, TeamEdit } from '@/entities/team';
import { teamsApi } from '@/shared/api/teamsApi';
import Dimmer from '@/shared/ui/Dimmer';
import { Heading } from '@/shared/ui/Heading';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { MouseEvent, useEffect, useState } from 'react';

export default function Structure() {
  const { data, isLoading, isFetching } = teamsApi.useGetTeamsQuery();
  const [open, setOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Team>();
  const [teamEdit, setTeamEdit] = useState<Team>();
  const [parentId, setParentId] = useState<number | undefined>();

  const [mutate, { isLoading: deleteLoading, isSuccess }] =
    teamsApi.useRemoveTeamMutation();

  const openModal = (e: MouseEvent, parentId: number) => {
    e.stopPropagation();
    setOpen(true);
    setParentId(parentId);
  };

  const openDeleteModal = (e: MouseEvent, team: Team) => {
    e.stopPropagation();
    setDeleteItem(team);
  };

  const openCreateModal = () => {
    setOpen(true);
    setParentId(undefined);
  };

  useEffect(() => {
    if (isSuccess) {
      setDeleteItem(undefined);
      setTeamEdit(undefined);
    }
  }, [isSuccess]);

  return (
    <Dimmer active={isLoading || isFetching}>
      <div className="px-8 py-10 flex flex-col">
        <div className="flex justify-between items-center">
          <Heading
            title="Орагнизационная структура"
            description="Струкрутра подразделений компании"
          />
          <PrimaryButton className="self-start" onClick={openCreateModal}>
            Добавить
          </PrimaryButton>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col max-w-lg mt-8">
            {!isFetching &&
              data?.structure?.map((team) => (
                <StructureItem
                  openDeleteModal={openDeleteModal}
                  openModal={openModal}
                  current={teamEdit?.id}
                  startEditing={setTeamEdit}
                  key={team.id}
                  team={team}
                />
              ))}
            {(isLoading || isFetching) &&
              new Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-12 mt-0.5 animate-pulse bg-gray-300"
                  />
                ))}
          </div>
          <TeamEdit team={teamEdit} />
        </div>
      </div>
      <AddTeamModal parentId={parentId} open={open} setOpen={setOpen} />
      <Modal
        open={!!deleteItem}
        loading={deleteLoading}
        setOpen={(open) => setDeleteItem(open ? deleteItem : undefined)}
        title={`Удалить команду ${deleteItem?.name}`}
        submitText="Удалить"
        variant="error"
        onSubmit={() => mutate(deleteItem!.id)}
      />
    </Dimmer>
  );
}
