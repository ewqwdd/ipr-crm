import WithAvatarsAndMultiLineContent from './WithAvatarsAndMultiLineContent';
import { Heading } from '@/shared/ui/Heading';
import { AddUser } from '@/widgets/AddUser';

// Компонент "Пользователи"
export default function Users() {
  return (
    <div className=" sm:px-6 lg:px-8 pt-10 flex-1">
      {/* Заголовок и кнопка добавления пользователя */}
      <div className="max-sm:px-4 sm:flex sm:items-center">
        <Heading
          title="Пользователи"
          description="Список всех пользователей в вашей учетной записи, включая имя, должность, email и роль."
        />
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <AddUser /> {/* Кнопка или форма добавления нового пользователя */}
        </div>
      </div>

      {/* Таблица или список пользователей */}
      <div className="mt-2 flex flex-col">
        <WithAvatarsAndMultiLineContent />{' '}
        {/* Контент с аватарками и многострочной информацией */}
      </div>
    </div>
  );
}
