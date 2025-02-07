import { AddTeamModal, TeamItem } from '@/entities/team';
import { teamsApi } from '@/shared/api/teamsApi';
import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useState } from 'react';

export default function Teams() {
  const { data } = teamsApi.useGetTeamsQuery();

  const list = data?.list ?? [];
  const [addAopen, setAddOpen] = useState(false);

  return (
    <div className="px-8 py-10 flex flex-col">
      <div className="flex justify-between items-center">
        <Heading
          title="Подразделения"
          description="Подразделения и пользователи"
        />
        <PrimaryButton className="self-start" onClick={() => setAddOpen(true)}>
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
  );
}
