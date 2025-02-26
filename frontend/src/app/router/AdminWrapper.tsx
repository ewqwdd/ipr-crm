import { Navigate } from 'react-router';
import { useAppSelector } from '../store/hooks';

interface AdminWrapperProps {
  children: React.ReactNode;
  curator?: boolean;
}

export default function AdminWrapper({ children, curator }: AdminWrapperProps) {
  const { isMounted, user } = useAppSelector((state) => state.user);

  if (!isMounted) {
    return null;
  }

  if (user?.role.name !== 'admin' && (!curator || !user?.teamCurator?.length)) {
    return <Navigate to="/404" />;
  }

  return children;
}
