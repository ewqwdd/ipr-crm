import { Avatar } from '@/shared/ui/Avatar'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'
import { TrashIcon } from '@heroicons/react/outline'
import { Link } from 'react-router'
import { TeamUser } from '../../types/types'
import { Badge } from '@/shared/ui/Badge'
import { teamsApi } from '@/shared/api/teamsApi'
import { cva } from '@/shared/lib/cva'

export default function TeamUserItem({ user, curator, teamId }: { user: TeamUser; curator?: boolean; teamId: number }) {
  const [mutate, { isLoading }] = teamsApi.useLeaveTeamMutation()
  const [mutateCurator, { isLoading: isLoadingCurator }] = teamsApi.useRemoveCuratorMutation()

  const fn = curator ? () => mutateCurator(teamId) : () => mutate({ teamId: teamId, userId: user.id })

  return (
    <div
      className={cva('flex items-center gap-2', {
        'animate-pulse pointer-events-none': isLoading || isLoadingCurator,
      })}
      key={user.id}
    >
      <Avatar src={user.avatar} className="size-8" />
      <Link to={`/users/${user.id}`} className="text-gray-900 text-sm font-medium hover hover:text-gray-600">
        {user.username}
      </Link>
      {curator && (
        <Badge size="md" color="purple" className="ml-2" border>
          Куратор
        </Badge>
      )}
      <PrimaryButton
        danger
        className="ml-auto mr-4 p-1"
        onClick={fn}
      >
        <TrashIcon className="size-4" />
      </PrimaryButton>
    </div>
  )
}
