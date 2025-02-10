import { Navigate } from 'react-router';
import { useAppSelector } from '../store/hooks';

interface AdminWrapperProps {
  children: React.ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  const { isMounted, user } = useAppSelector((state) => state.user);

  if (!isMounted) {
    return null;
  }

  if (user?.role.name !== 'admin') {
    return <Navigate to="/404" />;
  }

  return children;
}
