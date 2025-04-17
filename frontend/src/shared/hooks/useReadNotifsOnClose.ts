import { useAppDispatch, useAppSelector } from '@/app';
import { useEffect } from 'react';
import { $api } from '../lib/$api';
import { userActions } from '@/entities/user';
import { NotificationType } from '@/entities/notifications';

export const useReadNotifsOnClose = (types: NotificationType[]) => {
  const notifications = useAppSelector(
    (state) => state.user.user?.notifications,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      const notificationsToRead = notifications
        ?.filter((n) => !n.watched && types.includes(n.type))
        .map((n) => n.id);
      const readNotification = () => {
        $api.post('notification/read', { ids: notificationsToRead });
        dispatch(userActions.setNotificationRead(notificationsToRead!));
      };

      if (notificationsToRead && notificationsToRead.length > 0) {
        readNotification();
      }
    };
  }, [notifications, types]);
};
