import { teamsApi } from '@/shared/api/teamsApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { Link, useParams } from 'react-router';
import UserItem from './UserItem';
import { UsersIcon } from '@heroicons/react/outline';
import { useEffect, useMemo, useState } from 'react';
import CuratorModal from './CuratorModal';
import { Dropdown } from '@/shared/ui/Dropdown';
import { Modal } from '@/shared/ui/Modal';
import AddUserForm from '@/entities/user/ui/AddUserForm';
import { SpecsFilter } from '@/widgets/SpecsFilter';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useAppDispatch, useAppSelector } from '@/app';
import { usersApi } from '@/shared/api/usersApi';
import { SoftButton } from '@/shared/ui/SoftButton';

export default function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isFetching, isLoading } = teamsApi.useGetTeamQuery(Number(id));
  const [spec, setSpec] = useState<number | undefined>();
  const [openNewCurator, setOpenNewCurator] = useState(false);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [mutate, { isLoading: mutateLoading, isSuccess: mutateSuccess }] =
    teamsApi.useAddUsersMutation();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user);

  const count = (data?.users?.length ?? 0) + (data?.curator?.id ? 1 : 0);

  const filtered = useMemo(
    () =>
      spec
        ? data?.users?.filter((user) =>
            user?.user?.specsOnTeams.find((s) => s.specId === spec),
          )
        : data?.users,
    [data, spec],
  );

  useEffect(() => {
    if (mutateSuccess) {
      setOpenNewUser(false);
      dispatch(usersApi.util.invalidateTags(['User']));
    }
  }, [mutateSuccess]);

  useEffect(() => {
    if (!openNewUser) {
      setSelected([]);
    }
  }, [openNewUser]);

  const ifCuratorSelected =
    !spec || data?.curatorSpecs?.some((s) => s.specId === spec);

  let accessType: 'user' | 'admin' | 'curator' = 'user';

  if (user?.teamAccess?.find((t) => t === Number(id))) {
    accessType = 'admin';
    if (user?.teamCurator?.find((t) => t.id === Number(id))) {
      accessType = 'curator';
    }
  }
  if (user?.role.name === 'admin') {
    accessType = 'admin';
  }

  return (
    <LoadingOverlay active={isLoading || isFetching}>
      <div
        className={cva('px-4 py-6 sm:px-8 sm:py-10 flex flex-col', {
          'animate-pulse pointer-events-none': isFetching || mutateLoading,
        })}
      >
        <div className="flex justify-between items-center max-sm:pr-12">
          <Heading title={data?.name} description="Состав команды" />
          {['curator', 'admin'].includes(accessType) && (
            <Dropdown
              btnClassName="focus:ring-0"
              button={
                <PrimaryButton className="self-start">Добавить</PrimaryButton>
              }
              buttons={[
                {
                  text: 'Добавить участника',
                  onClick: () => setOpenNewUser(true),
                },
                ...(accessType === 'admin'
                  ? [
                      {
                        text: 'Назначить лидера',
                        onClick: () => setOpenNewCurator(true),
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </div>
        <div className="flex mt-4 items-center gap-6">
          <SpecsFilter setSpec={setSpec} spec={spec} />
          <p className="text-gray-500 text-sm flex">
            <UsersIcon className="size-4 inline-block mr-2" /> {count} человека
          </p>
        </div>
        <div className="flex flex-col gap-1 max-w-5xl mt-8">
          {data?.curator?.id && ifCuratorSelected && (
            <UserItem
              teamId={Number(id)}
              leader
              userId={data?.curator?.id}
              setOpenNew={setOpenNewCurator}
              curatorSpecs={data.curatorSpecs}
              accessType={accessType}
            />
          )}
          {filtered?.map((user) => (
            <UserItem
              teamId={Number(id)}
              userId={user?.userId}
              key={user?.id}
              specs={user.user?.specsOnTeams}
              accessType={accessType}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <h3 className="text-lg font-medium text-gray-900">
            Дочерние команды
          </h3>
          <div className="flex gap-2">
            {data?.subTeams?.map((team) => (
              <Link to={`/teams/${team.id}`} key={team.id}>
                <SoftButton>
                  {team.name}{' '}
                  <span className="opacity-80 font-normal">
                    {team.users && team.users.length} чел.
                  </span>
                </SoftButton>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <CuratorModal
        teamId={Number(id)}
        open={openNewCurator}
        setOpen={setOpenNewCurator}
        users={data?.users}
      />
      <Modal
        open={openNewUser}
        setOpen={setOpenNewUser}
        title="Добавить участника"
        onSubmit={() => mutate({ userIds: selected, teamId: Number(id) })}
        loading={mutateLoading}
      >
        <AddUserForm
          curatorId={data?.curator?.id}
          selected={selected}
          setSelected={setSelected}
          teamId={Number(id)}
        />
      </Modal>
    </LoadingOverlay>
  );
}
