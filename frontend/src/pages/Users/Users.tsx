import WithAvatarsAndMultiLineContent from './WithAvatarsAndMultiLineContent';
import { Heading } from '@/shared/ui/Heading';
import { AddUser } from '@/widgets/AddUser';

export default function Users() {
  return (
    <div className=" sm:px-6 lg:px-8 pt-10 flex-1">
      <div className="max-sm:px-4 sm:flex sm:items-center">
        <Heading
          title="Пользователи"
          description="Список всех пользователей в вашей учетной записи, включая имя, должность, email и роль."
        />
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <AddUser />
        </div>
      </div>

      <div className="mt-2 flex flex-col">
        <WithAvatarsAndMultiLineContent />{' '}
      </div>
    </div>
  );
}
