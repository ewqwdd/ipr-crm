import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight'
import { RolesSelect } from '@/widgets/RolesSelect'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { User, UserFormData } from '../types/types'
import toast from 'react-hot-toast'
import { emailRegex } from '@/shared/lib/regex'
import { styles } from '@/shared/lib/styles'
import { useNavigate } from 'react-router'
import { cva } from '@/shared/lib/cva'
import { SpecsSelect } from '@/widgets/SpecsSelect'

type UserFormErrors = Omit<UserFormData, 'avatar' | 'roleId' | 'specId'> & {
  avatar?: string
  roleId?: string
  specId?: string
}

interface UserFormProps {
  onSubmit?: (data: UserFormData) => void
  initData?: User
  loading?: boolean
  edit?: boolean
}

export default function UserForm({ onSubmit, initData, loading, edit }: UserFormProps) {
  const [data, setData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    username: '',
  })
  const [errors, setErrors] = useState<UserFormErrors>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    username: '',
    avatar: '',
    roleId: '',
  })
  const [photo, setPhoto] = useState<string | ArrayBuffer | null>()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Вы можете загружать только JPG/PNG файлы.')
      e.preventDefault()
      return
    }

    if (file.size / 1024 / 1024 >= 2) {
      toast.error('Размер изображения должен быть меньше 2MB.')
      e.preventDefault()
      return
    }

    setData({ ...data, avatar: file })
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhoto(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit_ = (e: FormEvent) => {
    e.preventDefault()
    let valid = true
    if (!emailRegex.test(data.email ?? '')) {
      setErrors((prev) => ({ ...prev, email: 'Некорректный email' }))
      valid = false
    }
    if (!data.firstName) {
      setErrors((prev) => ({ ...prev, firstName: 'Введите имя' }))
      valid = false
    }
    if (!data.lastName) {
      setErrors((prev) => ({ ...prev, lastName: 'Введите фамилию' }))
      valid = false
    }
    if (!data.username || data.username.length < 4) {
      setErrors((prev) => ({ ...prev, username: 'Имя пользователя должно быть минимум 4 симввола' }))
      valid = false
    }
    if (!data.roleId) {
      setErrors((prev) => ({ ...prev, roleId: 'Выберите роль' }))
      valid = false
    }
    if (!data.specId) {
      setErrors((prev) => ({ ...prev, specId: 'Выберите роль' }))
      valid = false
    }
    if (!edit && (!data.password || data.password.length < 7)) {
      setErrors((prev) => ({ ...prev, password: 'Пароль должен быть минимум 7 символов' }))
      valid = false
    }
    if (!valid) {
      toast.error('Пожалуйста, заполните все поля корректно.')
      return
    }
    onSubmit?.(data)
  }

  useEffect(() => {
    if (initData) {
      setData({
        email: initData.email,
        firstName: initData.firstName,
        lastName: initData.lastName,
        phone: initData.phone ?? '',
        password: '',
        username: initData.username,
        roleId: initData.role.id,
        specId: initData.Spec?.id ?? 0,
      })
      setPhoto(initData.avatar ?? null)
    }
  }, [initData])

  const setDataField = (field: keyof UserFormData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <form
      className={cva('space-y-8 divide-y divide-gray-200 py-10 px-8', {
        'animate-pulse': !!loading,
      })}
      onSubmit={onSubmit_}
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
            <p className="mt-1 text-sm text-gray-500">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  {import.meta.env.VITE_BASE_URL}/
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  value={data.username}
                  onChange={(e) => setDataField('username', e.target.value)}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
            {errors.username && <p className={cva(styles.errorStyles, 'col-span-6')}>{errors.username}</p>}
            {!edit && (
              <div className="sm:col-span-3">
                <InputWithLabelLight
                  label="Password"
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="password"
                  value={data.password}
                  onChange={(e) => setDataField('password', e.target.value)}
                  error={errors.password}
                />
              </div>
            )}
            <div className="sm:col-span-6">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-1 flex items-center">
                {photo ? (
                  <img
                    src={photo.toString()}
                    className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 object-cover"
                    alt="avatar"
                  />
                ) : (
                  <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  type="button"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change
                </button>
                <input type="file" ref={fileRef} onChange={onFileChange} className="hidden" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
            <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive mail.</p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputWithLabelLight
                label="First name"
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                value={data.firstName}
                onChange={(e) => setDataField('firstName', e.target.value)}
                error={errors.firstName}
              />
            </div>
            <div className="sm:col-span-3">
              <InputWithLabelLight
                label="Last name"
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                value={data.lastName}
                onChange={(e) => setDataField('lastName', e.target.value)}
                error={errors.lastName}
              />
            </div>

            <div className="sm:col-span-3">
              <InputWithLabelLight
                label="Email address"
                name="email"
                id="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setDataField('email', e.target.value)}
                error={errors.email}
              />
            </div>

            <div className="sm:col-span-3">
              <InputWithLabelLight
                label="Phone"
                type="text"
                name="phone"
                id="phone"
                autoComplete="phone"
                value={data.phone}
                onChange={(e) => setDataField('phone', e.target.value)}
                error={errors.phone}
              />
            </div>
            <div className="sm:col-span-2">
              <RolesSelect role={data.roleId} setRole={(e) => setDataField('roleId', e)} />
              {errors.roleId && <p className={styles.errorStyles}>{errors.roleId}</p>}
            </div>
            <div className="sm:col-span-2">
              <SpecsSelect spec={data.specId} setSpec={(e) => setDataField('specId', e)} />
              {errors.specId && <p className={styles.errorStyles}>{errors.specId}</p>}
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              We'll always let you know about important changes, but you pick what else you want to hear about.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  )
}
