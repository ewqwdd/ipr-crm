import { $api } from '@/shared/lib/$api';
import { emailRegex } from '@/shared/lib/regex';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PasswordResetModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function PasswordResetModal({
  isOpen,
  modalData,
  closeModal,
}: PasswordResetModalProps) {
  const { email: initEmail } = modalData as { email?: string };
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState<string>(initEmail ?? '');
  const [error, setError] = useState<string>('');

  const onSubmit = async () => {
    if (!email || !emailRegex.test(email)) {
      setError('Введите корректный email');
      return;
    }

    setIsLoading(true);
    await $api.post('/auth/reset-password', { email });
    setIsLoading(false);
    toast.success('Письмо для сброса пароля отправлено на почту');
    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={'Сброс пароля'}
      loading={isLoading}
      onSubmit={onSubmit}
    >
      <div className="mt-4">
        <InputWithLabelLight
          autoComplete="email"
          label="Почта"
          value={email}
          onChange={(e) => {
            setError('');
            setEmail(e.target.value);
          }}
          error={error}
        />
      </div>
    </Modal>
  );
}
