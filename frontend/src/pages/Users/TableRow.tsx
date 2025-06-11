import { useModal } from '@/app/hooks/useModal';
import { User } from '@/entities/user';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { generalService } from '@/shared/lib/generalService';
import { usersService } from '@/shared/lib/usersService';
import { Badge } from '@/shared/ui/Badge';
import { DotsDropdown } from '@/shared/ui/DotsDropdown';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

interface TableRowProps {
  person: Partial<User>;
  edit?: boolean;
  last?: boolean;
  skeleton?: boolean;
}

export default function TableRow({
  person,
  edit = true,
  last,
  skeleton,
}: TableRowProps) {
  const navigate = useNavigate();
  const [deleteUser, deleteState] = usersApi.useRemoveUserMutation();
  const isAdmin = useIsAdmin();
  const [loading, setLoading] = useState(false);
  const {openModal} = useModal();

  const resendInvite = () => {
    setLoading(true);
    $api
      .post('/users/resend-invite/' + person.id)
      .then(() => {
        toast.success('Приглашение повторно отправлено');
      })
      .catch(() => {
        toast.error('Ошибка при повторной отправке приглашения');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDelete = () => {
        openModal('CONFIRM', {
      submitText: 'Удалить',
      title: 'Удалить пользователя?',
      variant: 'error',
      onSubmit: async () => {
if (!person.id) return;
                      return await deleteUser(person.id);
      },
    });
  }

  useEffect(() => {
    if (deleteState.isSuccess) {
      toast.success('Пользователь успешно удален');
    }
    if (deleteState.isError) {
      toast.error('Ошибка при удалении пользователя');
    }
  }, [deleteState.isSuccess, deleteState.isError]);

  return (
    <tr
      className={cva({
        'animate-pulse pointer-events-none opacity-50':  !!loading,
        '[&_span]:opacity-60 [&_a]:opacity-60': !person?.access,
      })}
    >
      <td className={'whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'}>
        <div className="flex items-center">
          <Link to={`/users/${person?.id}`} className="h-10 w-10 flex-shrink-0">
            {person.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={generalService.transformFileUrl(person.avatar)}
                alt="avatar"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            )}
          </Link>
          <div className="ml-4">
            {skeleton ? (
              <div className="h-3 w-16 rounded-md bg-gray-200" />
            ) : (
              <Link
                to={`/users/${person?.id}`}
                className="font-medium text-gray-900"
              >
                {usersService.displayName(person)}
              </Link>
            )}
            <div className="text-gray-500">{person.email}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="text-gray-900">{person.Spec?.name}</div>
        <div className="text-gray-500">{person.username}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {person.teams?.map((e, index) => (
          <span key={e.teamId}>
            {e?.team?.name}
            {index !== person.teams!.length - 1 && ', '}
          </span>
        ))}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex flex-wrap gap-2 max-w-52">
          {person.specsOnTeams?.map((spec) => (
            <Badge color="green" key={spec.spec.id}>
              {spec.spec.name}
            </Badge>
          ))}
        </div>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 [&_span]:opacity-100">
        {!skeleton && (
          <div className="flex justify-end items-center gap-2">
            {person.access ? (
              <Badge color="green">Активен</Badge>
            ) : (
              <Badge color="red">Приглашен</Badge>
            )}
            {edit && (
              <DotsDropdown
                bodyClassName={cva('z-50', {
                  'origin-bottom-right bottom-full': !!last,
                })}
                buttons={[
                  {
                    text: 'Редактировать',
                    onClick: () => navigate('/userEdit/' + person.id),
                  },
                  {
                    text: 'Удалить',
                    onClick: onDelete,
                  },
                  ...(isAdmin && !person.access
                    ? [
                        {
                          text: 'Пригласить повторно',
                          onClick: () => resendInvite(),
                        },
                      ]
                    : []),
                ]}
              />
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
