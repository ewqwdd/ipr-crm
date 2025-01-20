import { useAppDispatch, useAppSelector } from '@/app'
import { userActions } from '@/entities/user'
import { $api } from '@/shared/lib/$api'
import { cva } from '@/shared/lib/cva'
import { emailRegex } from '@/shared/lib/regex'
import { styles } from '@/shared/lib/styles'
import { InputWithLabel } from '@/shared/ui/InputWithLabel'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'
import { AxiosError } from 'axios'
import { FormEvent, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email: string; password: string }>({ email: '', password: '' })
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)
  const isMounted = useAppSelector((state) => state.user.isMounted)
  const navigate = useNavigate()

  useEffect(() => {
    if (isMounted && user) {
      navigate('/')
    }
  }, [isMounted, user, navigate])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value
    const password = passwordRef.current?.value ?? ''
    let valid = true

    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }))
      valid = false
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email' }))
      valid = false
    } else {
      setErrors((prev) => ({ ...prev, email: '' }))
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }))
      valid = false
    } else {
      setErrors((prev) => ({ ...prev, password: '' }))
    }
    if (!valid) return

    setLoading(true)
    $api
      .post('/auth/sign-in', { email, password })
      .then((res) => {
        dispatch(userActions.setUser(res.data))
        toast.success('Logged in successfully')
      })
      .catch((err) => {
        console.log(err)
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message)
          return
        }
        toast.error('Something went wrong')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="min-h-full flex flex-col w-full items-center justify-center bg-gray-900">
      <form
        className={cva('flex flex-col max-w-96 w-full gap-7', {
          'animate-pulse': loading,
        })}
        onSubmit={onSubmit}
      >
        <img
          className="h-10 w-auto self-center"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
          alt="Workflow"
        />
        <h1 className="text-2xl font-bold text-white text-center my-3">Sign in to your account</h1>
        <InputWithLabel ref={emailRef} error={errors.email} label="Email" />
        <InputWithLabel
          ref={passwordRef}
          error={errors.password}
          label="Password"
          right={<button className={styles.linkStyles}>Forgot password?</button>}
        />
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>
    </div>
  )
}
