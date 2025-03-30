import { useAppSelector } from '@/app';

export const useIsAdmin = (): boolean => {
  const role = useAppSelector((state) => state.user.user?.role);
  return role?.name === 'admin';
};
