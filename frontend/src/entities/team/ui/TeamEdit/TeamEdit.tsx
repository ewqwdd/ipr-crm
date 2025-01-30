import { teamsApi } from '@/shared/api/teamsApi'
import { CreateTeamDto, Team } from '../../types/types'
import TeamForm from '../TeamForm/TeamForm'
import { usersApi } from '@/shared/api/usersApi'
import { useEffect } from 'react'

interface TeamEditProps {
  team?: Team
}

export default function TeamEdit({ team }: TeamEditProps) {
  const [mutate, { isLoading, isSuccess }] = teamsApi.useUpdateTeamMutation()
  const { refetch } = usersApi.useGetUsersQuery({})

  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess])

  if (!team) return null

  const onSubmit = (values: CreateTeamDto) => {
    mutate({
      id: team.id,
      team: {
        name: values.name,
        description: values.description,
        parentTeamId: values?.parentTeamId,
        curatorId: values.curatorId,
      },
    })
  }

  return (
    <div className="flex-1 flex justify-end">
      <TeamForm className="max-w-96" initData={team} onSubmit={onSubmit} loading={isLoading} />
    </div>
  )
}
