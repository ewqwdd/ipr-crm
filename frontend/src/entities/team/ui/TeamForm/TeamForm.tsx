import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { CreateTeamDto, Team } from '../../types/types';
import { cva } from '@/shared/lib/cva';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { TextArea } from '@/shared/ui/TextArea';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { UsersSelect } from '@/shared/ui/UsersSelect';
import { TeamsSelect } from '@/widgets/TeamSelect';
import { teamsApi } from '@/shared/api/teamsApi';
import { generalService } from '@/shared/lib/generalService';

type ErrorType = {
  name?: string;
  description?: string;
  parentId?: string;
  curators?: string;
};

interface TeamFormProps {
  parentId?: number;
  onSubmit: (values: CreateTeamDto) => void;
  initData?: Team;
  loading?: boolean;
  className?: string;
}

export default forwardRef(function TeamForm(
  { parentId, onSubmit, initData, loading, className }: TeamFormProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  const [errors, setErrors] = useState<ErrorType>({});
  const [data, setData] = useState<CreateTeamDto>({
    name: '',
    description: '',
    parentTeamId: parentId,
  });
  const { data: usersData, isLoading } = usersApi.useGetUsersQuery({});
  const { data: teamsData } = teamsApi.useGetTeamsQuery();

  const { users } = usersData || {};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.name === '') {
      setErrors({ name: 'Name is required' });
      return;
    }
    onSubmit(data);
  };

  const fieldChange = <T,>(value: T, field: keyof CreateTeamDto) => {
    setData({ ...data, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  useEffect(() => {
    if (initData) {
      setData(initData);
    } else {
      setData({
        name: '',
        description: '',
        parentTeamId: parentId,
        curatorId: undefined,
      });
    }
  }, [initData, parentId]);

  const groups =
    teamsData?.structure
      .flatMap((g) =>
        g.subTeams?.flatMap((t) => t.subTeams).flatMap((g) => g?.subTeams),
      )
      .filter((g) => !!g) ?? [];

  const disabledTeams = initData
    ? generalService.findDisabledTeams(initData)
    : [];
  // const disabledUsers = initData ? initData.users?.map(u => u.user.id) : []

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={cva('mt-6 gap-3 flex flex-col flex-1', className, {
        'animate-pulse': !!loading,
      })}
    >
      <InputWithLabelLight
        value={data.name}
        label="Имя"
        name="name"
        error={errors.name}
        onChange={(e) => fieldChange(e.target.value, 'name')}
      />
      <TextArea
        value={data.description}
        label="Описание"
        name="description"
        error={errors.description}
        onChange={(e) => fieldChange(e.target.value, 'description')}
      />
      <TeamsSelect
        label="Родительская команда"
        disabledTeams={[...disabledTeams, ...groups.map((g) => g.id)]}
        team={data.parentTeamId}
        setTeam={({ id }) => fieldChange(id, 'parentTeamId')}
      />
      <div className="flex flex-col gap-1">
        <label className="block text-sm font-medium text-gray-700">Лидер</label>
        <UsersSelect
          users={users || []}
          loading={isLoading}
          value={data.curatorId}
          setValue={(value) => fieldChange(value, 'curatorId')}
          // disabledUsers={disabledUsers}
        />
      </div>
      <PrimaryButton type="submit" className="self-end mt-2">
        Подтвердить
      </PrimaryButton>
    </form>
  );
});
