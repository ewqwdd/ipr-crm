import { FC } from 'react';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';

type WithAdminAccessProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

const WithAdminAccess: FC<WithAdminAccessProps> = ({
  children,
  fallback = null,
}) => {
  const isAdmin = useIsAdmin();

  if (isAdmin) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default WithAdminAccess;
