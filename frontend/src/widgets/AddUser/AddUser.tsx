import { useModal } from '@/app/hooks/useModal';
import { $api } from '@/shared/lib/$api';
import { Dropdown } from '@/shared/ui/Dropdown';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export default function AddUser() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleInviteAll = () => {
    openModal('CONFIRM', {
      submitText: 'Отправить',
      title: 'Повторно пригласить всех участников?',
      onSubmit: () => {
        toast.success('Приглашения отправлены всем участникам');
        $api.post('/users/invite/all').catch((error) => {
          console.error('Ошибка при отправке приглашений:', error);
          toast.error('Произошла ошибка при отправке приглашений');
        });
      },
    });
  };

  return (
    <Dropdown
      btnClassName="focus:ring-0"
      buttons={[
        {
          text: 'Добавить участника',
          onClick: () => navigate('/addUser'),
        },
        {
          text: 'Пригласить по почте',
          onClick: () => openModal('INVITE'),
        },
        {
          text: 'Импортировать из файла',
          onClick: () => openModal('IMPORT_USERS'),
        },
        {
          text: 'Повторно пригласить всех участников',
          onClick: handleInviteAll,
        },
      ]}
      button={<PrimaryButton>Добавить пользователя</PrimaryButton>}
    />
  );
}
