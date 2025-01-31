import { teamsApi } from '@/shared/api/teamsApi'
import { Accordion } from '@/shared/ui/Accordion'
import { Avatar } from '@/shared/ui/Avatar'
import { useMemo } from 'react'

export default function AddRate() {
  const { data } = teamsApi.useGetTeamsQuery()

    const filtered = useMemo(() => data?.list?.filter((team) => team.users && team.users?.length > 0), [data])

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3"></div>

      <h2 className="text-2xl font-semibold">Выберите оцениваемых</h2>

      <div className="flex flex-col gap-2">
        {filtered?.map((team) => <div key={team.id} className="flex flex-col gap-2">
            <Accordion title={team.name} defaultOpen titleClassName='text-indigo-600 pl-4'>
              <div className='flex flex-col gap-2 ml-4'>
              {team.users?.map((user) => (
                <div key={user.user.id} className="flex items-center gap-2">
                  <Avatar src={user.user.avatar} />
                  <span>{user.user.username}</span>
                </div>
              ))}
                </div>
            </Accordion>
        </div>)}
      </div>
    </div>
  )
}
