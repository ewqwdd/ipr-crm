import { UserForm } from '@/entities/user'
import { UserFormData } from '@/entities/user/types/types'
import { usersApi } from '@/shared/api/usersApi'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function AddUser() {
  const [mutate, {isSuccess, isLoading}] = usersApi.useCreateUserMutation()
  const navigate = useNavigate()

  const onSubmit = async (data: UserFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value)
      }
    })
    mutate(formData)
  }

  useEffect(() => {
      if (isSuccess) {
        navigate(-1)
      }
  }, [isSuccess])

  return <UserForm loading={isLoading} onSubmit={onSubmit} />
}
