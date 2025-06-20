import { useAppDispatch, useAppSelector } from '@/app';
import { useModal } from '@/app/hooks/useModal';
import { userActions } from '@/entities/user';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { emailRegex } from '@/shared/lib/regex';
import { styles } from '@/shared/lib/styles';
import { InputWithLabel } from '@/shared/ui/InputWithLabel';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { AxiosError } from 'axios';
import { FormEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const isMounted = useAppSelector((state) => state.user.isMounted);
  const navigate = useNavigate();
  const { openModal } = useModal();

  useEffect(() => {
    if (isMounted && user) {
      navigate('/');
    }
  }, [isMounted, user, navigate]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value ?? '';
    let valid = true;

    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Введите почту' }));
      valid = false;
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Неверная почта' }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Введите пароль' }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
    if (!valid) return;

    setLoading(true);
    $api
      .post('/auth/sign-in', { email, password })
      .then((res) => {
        dispatch(userActions.setUser(res.data));
        toast.success('Вы вошли в аккаунт');
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message);
          return;
        }
        toast.error('Ошибка при входе в аккаунт');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetPassword = () =>
    openModal('PASSWORD_RESET', { email: emailRef.current?.value });

  return (
    <div className="min-h-full flex flex-col w-full items-center justify-center bg-gray-900 px-6">
      <form
        className={cva('flex flex-col max-w-96 w-full gap-7', {
          'animate-pulse': loading,
        })}
        onSubmit={onSubmit}
      >
        <div className="flex flex-col items-center gap-2">
          <img
            className="h-10 w-auto self-center"
            src="/tailwind.svg"
            alt="Workflow"
          />
          <h1 className="text-2xl font-bold text-white text-center my-3">
            AYA SKILLS
          </h1>
          <p className="text-sm text-gray-400 text-center">
            Войдите в свой аккаунт, чтобы продолжить
          </p>
        </div>

        <InputWithLabel
          autoComplete="email webauthn"
          ref={emailRef}
          error={errors.email}
          label="Почта"
        />
        <InputWithLabel
          autoComplete="current-password webauthn"
          ref={passwordRef}
          error={errors.password}
          label="Пароль"
          type="password"
          right={
            <button
              type="button"
              onClick={resetPassword}
              className={styles.linkStyles}
            >
              Забыли пароль?
            </button>
          }
        />
        <PrimaryButton type="submit">Войти</PrimaryButton>
      </form>
    </div>
  );
}
