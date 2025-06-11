import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { UserProfile } from '@/entities/user';

export default function UserPage() {
  const { id } = useParams();
  const { data, isError } = usersApi.useGetUserByIdQuery(Number(id));
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      navigate('/users');
    }
  }, [isError]);

  if (!data) return null;

  return <UserProfile data={data} />;
}
