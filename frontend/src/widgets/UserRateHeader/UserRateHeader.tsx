import { useAppSelector } from '@/app';
import { Rate } from '@/entities/rates';
import { usersApi } from '@/shared/api/usersApi';
import { cva } from '@/shared/lib/cva';
import { displayName } from '@/shared/lib/displayName';
import { Avatar } from '@/shared/ui/Avatar';
import { memo } from 'react';
import { Link } from 'react-router';

interface UserHeaderProps {
  rate?: Rate;
}

export default memo(function UserRateHeader({ rate }: UserHeaderProps) {
  const { data, isLoading } = usersApi.useGetUsersQuery({});
  const user = useAppSelector((state) => state.user.user);
  const foundUser = data?.users.find((user) => user.id === rate?.userId);

  const isTeamAccessible =
    rate?.teamId &&
    (user?.role.name === 'admin' || user?.teamAccess.includes(rate?.teamId));

  return (
    <div
      className={cva('flex gap-4', {
        'animate-pulse pointer-events-none opacity-50': isLoading,
      })}
    >
      <Avatar
        src={foundUser?.avatar}
        className="sm:size-12 size-10 rounded-md border-black/5 border"
      />
      <div className="flex flex-col">
        <h2 className="sm:text-lg text-base leading-6 font-medium text-gray-900">
          {(foundUser && displayName(foundUser)) ?? '-'}
        </h2>
        {isTeamAccessible ? (
          <Link
            to={`/teams/${rate.teamId}`}
            className="text-sm font-medium text-violet-600"
          >
            {rate?.team?.name ?? '-'}
          </Link>
        ) : (
          <p className="text-sm text-gray-600">{rate?.team?.name ?? '-'}</p>
        )}
      </div>
    </div>
  );
});
