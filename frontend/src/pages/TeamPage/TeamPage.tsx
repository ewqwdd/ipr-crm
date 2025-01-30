import { teamsApi } from '@/shared/api/teamsApi'
import { cva } from '@/shared/lib/cva'
import { Heading } from '@/shared/ui/Heading'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'
import { useParams } from 'react-router'
import UserItem from './UserItem'
import { UsersIcon } from '@heroicons/react/outline'
import { useEffect, useMemo, useState } from 'react'
import SpecsFilter from './SpecsFilter'
import CuratorModal from './CuratorModal'
import { Dropdown } from '@/shared/ui/Dropdown'
import { Modal } from '@/shared/ui/Modal'
import AddUserForm from '@/entities/user/ui/AddUserForm'
import { usersApi } from '@/shared/api/usersApi'

export default function TeamPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = teamsApi.useGetTeamQuery(Number(id))
  const [spec, setSpec] = useState<number | undefined>()
  const [openNewCurator, setOpenNewCurator] = useState(false)
  const [openNewUser, setOpenNewUser] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [mutate, { isLoading: mutateLoading, isSuccess: mutateSuccess }] = teamsApi.useAddUsersMutation()
  const {refetch} = usersApi.useGetUsersQuery({})

  const count = (data?.users?.length ?? 0) + (data?.curator?.id ? 1 : 0)

  const filtered = useMemo(
    () => (spec ? data?.users?.filter((user) => user?.user?.specsOnTeams.find((s) => s.specId === spec)) : data?.users),
    [data, spec]
  )

  useEffect(() => {
    if (mutateSuccess) {
      setOpenNewUser(false)
      refetch()
    }
  }, [mutateSuccess])

  return (
    <>
      <div
        className={cva('px-8 py-10 flex flex-col', {
          'animate-pulse pointer-events-none': isLoading || mutateLoading,
        })}
      >
        <div className="flex justify-between items-center">
          <Heading title={data?.name} description="Состав команды" />
          <Dropdown
            btnClassName="focus:ring-0"
            button={<PrimaryButton className="self-start">Добавить</PrimaryButton>}
            buttons={[
              {
                text: 'Добавить участника',
                onClick: () => setOpenNewUser(true),
              },
              {
                text: 'Назначить лидера',
                onClick: () => setOpenNewCurator(true),
              },
            ]}
          />
        </div>
        <div className="flex mt-4 items-center gap-6">
          <SpecsFilter setSpec={setSpec} spec={spec} />
          <p className="text-gray-500 text-sm flex">
            <UsersIcon className="size-4 inline-block mr-2" /> {count} человека
          </p>
        </div>
        <div className="flex flex-col gap-1 max-w-5xl mt-8">
          {data?.curator?.id && (
            <UserItem teamId={Number(id)} leader userId={data?.curator?.id} setOpenNew={setOpenNewCurator} />
          )}
          {filtered?.map((user) => (
            <UserItem teamId={Number(id)} userId={user?.userId} key={user?.id} specs={user.user?.specsOnTeams} />
          ))}
        </div>
      </div>
      <CuratorModal teamId={Number(id)} open={openNewCurator} setOpen={setOpenNewCurator} users={data?.users} />
      <Modal
        open={openNewUser}
        setOpen={setOpenNewUser}
        title="Добавить участника"
        onSubmit={() => mutate({ userIds: selected, teamId: Number(id) })}
        loading={mutateLoading}
      >
        <AddUserForm curatorId={data?.curator?.id} selected={selected} setSelected={setSelected} teamId={Number(id)} />
      </Modal>
    </>
  )
}
