import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { InputWithLabel } from '@/shared/ui/InputWithLabel';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const authCodeRef = useRef<string>('');
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      sessionStorage.setItem('authCode', code || '');
      authCodeRef.current = code;
      setSearchParams('');
    }
  }, [searchParams, setSearchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (!password || password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }
    const code = authCodeRef.current ?? sessionStorage.getItem('authCode');
    if (!code) {
      toast.error('Код не найден');
      return;
    }
    setLoading(true);

    try {
      await $api.post('/users/invite-accept', {
        password,
        code,
      });
      toast.success('Пароль успешно создан');
      navigate('/login');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message || 'Ошибка при создании пароля',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onChange = () => setError('');

  return (
    <div className="min-h-full flex flex-col w-full items-center justify-center bg-gray-900 px-6">
      <form
        onSubmit={onSubmit}
        className={cva('flex flex-col max-w-96 w-full gap-7', {
          'animate-pulse pointer-events-none': loading,
        })}
      >
        <img
          className="h-10 w-auto self-center"
          src="/tailwind.svg"
          alt="Workflow"
        />
        <h1 className="text-2xl font-bold text-white text-center my-3">
          Придумайте пароль
        </h1>
        <InputWithLabel
          ref={passwordRef}
          label="Пароль"
          type="password"
          onChange={onChange}
        />
        <InputWithLabel
          ref={passwordConfirmRef}
          error={error}
          label="Повторите пароль"
          type="password"
          onChange={onChange}
        />
        <PrimaryButton type="submit">Задать пароль</PrimaryButton>
      </form>
    </div>
  );
}
