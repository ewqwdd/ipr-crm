import { useAppSelector } from '@/app';
import { UserProfile } from '@/entities/user';

export default function Profile() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  return <UserProfile data={user} />;
}
