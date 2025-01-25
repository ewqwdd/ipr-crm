import { User } from '@/entities/user'
import { SearchSelect } from '../SearchSelect'

interface UserMultiSelectProps {
  users: User[]
  value?: number
  loading?: boolean
  disabledUsers?: number[]
  setValue: (value: number) => void
}

export default function UsersSelect({ users, loading, value, disabledUsers, setValue }: UserMultiSelectProps) {
  const options = users
    .filter((u) => !disabledUsers?.includes(u.id))
    .map((user) => ({ id: user.id, name: user.username }))

  return <SearchSelect loading={loading} value={value} options={options} onChange={({ id }) => setValue(id)} />
}
