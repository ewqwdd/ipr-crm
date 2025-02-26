import { useModal } from '@/app/hooks/useModal';
import { Dropdown } from '@/shared/ui/Dropdown';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useNavigate } from 'react-router';

export default function AddUser() {
  const navigate = useNavigate();
  const { openModal } = useModal();

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
      ]}
      button={<PrimaryButton>Добавить пользователя</PrimaryButton>}
    />
  );
}
