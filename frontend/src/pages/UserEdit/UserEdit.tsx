import { UserForm } from '@/entities/user'
import { usersApi } from '@/shared/api/usersApi'
import { useParams } from 'react-router'

export default function UserEdit() {
  const { id } = useParams()
  const { data, isFetching } = usersApi.useGetUserByIdQuery(Number(id))

  return <UserForm loading={isFetching} initData={data} edit />
}
