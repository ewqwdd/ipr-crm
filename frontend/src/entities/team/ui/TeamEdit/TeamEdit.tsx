import { teamsApi } from '@/shared/api/teamsApi'
import { CreateTeamDto, Team } from '../../types/types'
import TeamForm from '../TeamForm/TeamForm'

interface TeamEditProps {
  team?: Team
}

export default function TeamEdit({ team }: TeamEditProps) {
  const [mutate, { isLoading }] = teamsApi.useUpdateTeamMutation()

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
