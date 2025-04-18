import { useEffect } from 'react';
import { $api } from '../lib/$api';
import { useAppDispatch, useAppSelector } from '@/app';
import { userActions } from '@/entities/user';

export const useCheckNotifications = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (!user) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    interval = setInterval(
      () => {
        $api.get('/notification').then((res) => {
          dispatch(userActions.setNotifications(res.data));
        });
      },
      1000 * 60 * 5,
    ); // 5 minutes

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);
};
