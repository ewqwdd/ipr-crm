import { useAppSelector } from '@/app';
import { User } from '@/entities/user';
import { Badge } from '@/shared/ui/Badge';

interface DeputyListProps {
  user: Pick<User, 'deputyRelationsAsDeputy' | 'id'>;
}

export default function DeputyList({ user }: DeputyListProps) {
  const currentUser = useAppSelector((state) => state.user.user);
  const isAdmin = currentUser?.role.name === 'admin';

  return isAdmin && user.deputyRelationsAsDeputy?.length > 0 ? (
    <div className="flex gap-1 items-center text-xs sm:text-sm text-gray-800 flex-wrap">
      Заместитель у:
      {user.deputyRelationsAsDeputy.map((deputy) => (
        <Badge color="green" size="md" key={deputy.user.id}>
          {deputy.user.username}
        </Badge>
      ))}
    </div>
  ) : currentUser?.deputyRelationsAsUser?.some(
      (deputy) => deputy.deputy.id === user.id,
    ) ? (
    <Badge color="green" size="md">
      Ваш заместитель
    </Badge>
  ) : null;
}
