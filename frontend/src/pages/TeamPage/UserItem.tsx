import { TeamSingle } from '@/entities/team'
import { teamsApi } from '@/shared/api/teamsApi'
import { universalApi } from '@/shared/api/universalApi'
import { usersApi } from '@/shared/api/usersApi'
import { cva } from '@/shared/lib/cva'
import { SelectOption } from '@/shared/types/SelectType'
import { Avatar } from '@/shared/ui/Avatar'
import { Badge } from '@/shared/ui/Badge'
import AddSpecModal from '@/widgets/AddSpecModal/AddSpecModal'
import { BriefcaseIcon, PencilIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import LeaderDropdown from './LeaderDropdown'

interface UserItemProps {
  userId: number
  leader?: boolean
  specs?: TeamSingle['users'][0]['user']['specsOnTeams']
  teamId: number
  setOpenNew?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UserItem({ userId, leader, specs, teamId, setOpenNew }: UserItemProps) {
  const { data } = usersApi.useGetUsersQuery({})
  const [open, setOpen] = useState(false)
  const user = data?.users?.find((user) => user.id === userId)
  const [mutate, { isLoading: mutateLoading, isSuccess }] = teamsApi.useSetTeamSpecsMutation()
  const {data: specsData, isLoading: isSpecsLoading} = universalApi.useGetSpecsQuery()
  const [spec, setSpec] = useState<SelectOption[]>([])

  useEffect(() => {
    if (isSuccess) {
      setOpen(false)
    }
  }, [isSuccess])

  useEffect(() => {
    if (specs) {
      setSpec(specs.map((spec) => specsData?.find((e) => e.id === spec.specId) ?? { id: spec.specId, name: '' }))
    }
  }, [specs])


  return (
    <>
      <div className="flex justify-between py-5 border-b-gray-300 border-b">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Avatar src={user?.avatar} className="size-8" />
            <Link to={`/users/${user?.id}`} className="text-gray-800 font-semibold text-lg">
              {user?.username}
            </Link>
            {leader && (
              <Badge color="purple" size="sm">
                Лидер <LeaderDropdown teamId={teamId} setOpenNew={setOpenNew} />
              </Badge>
            )}
          </div>
          {!leader && <div className={cva("text-gray-500 text-sm flex gap-2 items-center mt-2", {
            'animate-pulse pointer-events-none': isSpecsLoading
          })}>
            <BriefcaseIcon className="size-4" />
            <p className="-ml-1 mr-2 font-medium text-sm text-gray-500">Специализация</p>{' '}
            {specs?.map((e, i) => (
              <Badge key={i} size="sm" border color="gray">
                {specsData?.find((spec) => spec.id === e.specId)?.name}
              </Badge>
            ))}
            <button className="rounded-full p-1 hover:bg-gray-300 ml-1" onClick={() => setOpen(true)}>
              <PencilIcon className="size-4 text-indigo-500" />
            </button>
          </div>}
        </div>
      </div>
      <AddSpecModal
        loading={mutateLoading}
        value={spec}
        setValue={setSpec}
        setOpen={setOpen}
        open={open}
        onSubmit={() => mutate({ specs: spec.map((e) => e.id), teamId: teamId, userId })}
      />
    </>
  )
}
