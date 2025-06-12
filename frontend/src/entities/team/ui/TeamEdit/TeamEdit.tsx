import { teamsApi } from '@/shared/api/teamsApi';
import { CreateTeamDto, Team } from '../../types/types';
import TeamForm from '../TeamForm/TeamForm';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface TeamEditProps {
  team?: Team;
}

export default function TeamEdit({ team }: TeamEditProps) {
  const [mutate, { isLoading, isSuccess, error }] =
    teamsApi.useUpdateTeamMutation();
  const { refetch } = usersApi.useGetUsersQuery();

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      // @ts-ignore
      toast.error(error?.data?.message || 'Ошибка при редактировании команды');
    }
  }, [error]);

  if (!team) return null;

  const onSubmit = (values: CreateTeamDto) => {
    mutate({
      id: team.id,
      team: {
        name: values.name,
        description: values.description,
        parentTeamId: values?.parentTeamId,
        curatorId: values.curatorId,
      },
    });
  };

  return (
    <div className="flex-1 flex justify-end">
      <TeamForm
        className="max-w-96"
        initData={team}
        onSubmit={onSubmit}
        loading={isLoading}
      />
    </div>
  );
}
