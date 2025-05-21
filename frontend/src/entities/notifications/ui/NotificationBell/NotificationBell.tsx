import { useAppDispatch, useAppSelector } from '@/app';
import { userActions } from '@/entities/user';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { Dropdown } from '@/shared/ui/Dropdown';
import { PingCircle } from '@/shared/ui/PingCircle';
import { BellIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';

export default function NotificationBell() {
  const notifications = useAppSelector(
    (state) => state.user.user?.notifications,
  );
  const dispatch = useAppDispatch();

  const readNotification = (id: number) => {
    $api.post('notification/read', { ids: [id] });
    dispatch(userActions.setNotificationRead([id]));
  };

  const count = notifications?.length ?? 0;
  const countRead = notifications?.filter((n) => !n.watched).length ?? 0;

  const button = (
    <div className="relative">
      <BellIcon className="size-6" />
      {count > 0 && <PingCircle>{countRead}</PingCircle>}
    </div>
  );

  return (
    <Dropdown
      button={button}
      btnClassName={cva(
        'text-indigo-500 hover:text-indigo-700 bg-transparent transition-all duration-100 p-2',
        {
          'pointer-events-none opacity-70': count === 0,
        },
      )}
    >
      {notifications?.map((notification) => {
        const Cmp = notification.url ? Link : 'button';
        return (
          <Cmp
            className={cva(
              'flex flex-col gap-1 py-1.5 px-2 hover:bg-gray-800/10 ransition-all rounded-lg w-full text-left',
              {
                'pointer-events-none opacity-50': notification.watched,
              },
            )}
            key={notification.id}
            to={notification.url!}
            onClick={() => readNotification(notification.id)}
          >
            <h4 className="text-sm font-semibold text-gray-800 truncate">
              {notification.title}
            </h4>
            {notification.description && (
              <span className="text-xs text-gray-600 truncate">
                {notification.description}
              </span>
            )}
          </Cmp>
        );
      })}
    </Dropdown>
  );
}
