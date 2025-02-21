import { $api } from '@/shared/lib/$api';
import { emailRegex } from '@/shared/lib/regex';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface InviteModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface ErrorState {
  name?: string;
  surname?: string;
  middleName?: string;
  email?: string;
}

export default function InviteModal({ isOpen, closeModal }: InviteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<ErrorState>({});

  const onSubmit = async () => {
    const name = nameRef.current?.value;
    const surname = surnameRef.current?.value;
    const email = emailRef.current?.value;

    let valid = true;

    if (!name || name.length < 2) {
      setErrors((prev) => ({ ...prev, name: 'Имя обязательно' }));
      valid = false;
    }
    if (!surname || surname.length < 2) {
      setErrors((prev) => ({ ...prev, surname: 'Фамилия обязательна' }));
      valid = false;
    }
    if (!email || !emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Email обязателен' }));
      valid = false;
    }
    if (!valid) return;
    try {
      setIsLoading(true);
      await $api.post('/users/invite', { name, surname, email });
      toast.success('Приглашение отправлено');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message || 'Ошибка при отправке приглашения',
        );
        return;
      }
      toast.error('Ошибка при отправке приглашения');
    } finally {
      setIsLoading(false);

      closeModal();
    }
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={'Пригласить участника'}
      onSubmit={onSubmit}
      submitText={'Пригласить'}
      loading={isLoading}
    >
      <div className="flex flex-col gap-2 mt-6">
        <InputWithLabelLight
          ref={nameRef}
          label="Имя"
          error={errors['name']}
          onChange={() => setErrors((prev) => ({ ...prev, name: '' }))}
        />
        <InputWithLabelLight
          ref={surnameRef}
          label="Фамилия"
          error={errors['surname']}
          onChange={() => setErrors((prev) => ({ ...prev, surname: '' }))}
        />
        <InputWithLabelLight
          ref={emailRef}
          label="Email"
          error={errors['email']}
          onChange={() => setErrors((prev) => ({ ...prev, email: '' }))}
        />
      </div>
    </Modal>
  );
}
