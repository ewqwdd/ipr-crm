import { usersApi } from '@/shared/api/usersApi'
import { Avatar } from '@/shared/ui/Avatar'
import { Badge } from '@/shared/ui/Badge'
import { Link } from 'react-router'

interface UserItemProps {
  userId: number
  leader?: boolean
}

export default function UserItem({ userId, leader }: UserItemProps) {
  const { data } = usersApi.useGetUsersQuery({})
  const user = data?.users?.find((user) => user.id === userId)
  console.log(user, data?.users, userId)

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Avatar src={user?.avatar} className="size-8" />
          <Link to={`/users/${user?.id}`} className="text-gray-800 font-semibold text-lg">
            {user?.username}
          </Link>
          {leader && (
            <Badge color="purple" size="sm">
              Лидер
            </Badge>
          )}
        </div>
        <div className="text-gray-500 text-sm">Специализация {user?.Spec?.name}</div>
      </div>
    </div>
  )
}
