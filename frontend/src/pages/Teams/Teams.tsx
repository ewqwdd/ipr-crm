import { useAppSelector } from '@/app';
import { AddTeamModal, TeamItem } from '@/entities/team';
import { teamsApi } from '@/shared/api/teamsApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import {  useMemo, useState } from 'react';

export default function Teams() {
  const { data, isFetching } = teamsApi.useGetTeamsQuery();
  const user = useAppSelector((state) => state.user.user);
  const isAdmin = user?.role.name === 'admin';
  const [addAopen, setAddOpen] = useState(false);


  const list = useMemo(() => {
    if (!data?.list) return [];
    if (isAdmin) {
      return data.list;
    } else {
      return data.list.filter(
        (team) => !!user?.teamCurator?.find((t) => t.id === team.id),
      );
    }
  }, [data, isAdmin, user]);

  return (
    <LoadingOverlay active={isFetching}>
      <div className="px-8 py-10 flex flex-col">
        <div className="flex justify-between items-center">
          <Heading
            title="Подразделения"
            description="Подразделения и пользователи"
          />
          <PrimaryButton
            className="self-start"
            onClick={() => setAddOpen(true)}
          >
            Добавить
          </PrimaryButton>
        </div>
        <div className="flex flex-col gap-1 max-w-5xl mt-8">
          {list.map((team) => (
            <TeamItem key={team.id} team={team} />
          ))}
        </div>
        <AddTeamModal open={addAopen} setOpen={setAddOpen} />
      </div>
    </LoadingOverlay>
  );
}
