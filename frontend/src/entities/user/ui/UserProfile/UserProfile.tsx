import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { SoftButton } from '@/shared/ui/SoftButton';
import { Link } from 'react-router';
import UserDataItem from './ui/UserDataItem';
import { User } from '../../types/types';
import { useAppSelector } from '@/app';
import { generalService } from '@/shared/lib/generalService';
import UserDeputyOf from './ui/UserDeputyOf';
import UserDeputy from './ui/UserDeputy';

interface UserProfileProps {
  data: User;
}

export default function UserProfile({ data }: UserProfileProps) {
  const user = useAppSelector((state) => state.user.user);

  const canEdit = user?.role?.name === 'admin' || user?.id === data.id;

  const editLink = user?.id === data.id ? '/userEdit' : `/userEdit/${data.id}`;

  const name =
    !data?.firstName && !data?.lastName
      ? 'Имя не задано'
      : data?.firstName + ' ' + data?.lastName;

  return (
    <main className="py-10">
      {/* Page header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <Avatar
                src={generalService.transformFileUrl(data?.avatar)}
                className="size-16"
              />
              <span
                className="absolute inset-0 shadow-inner rounded-full"
                aria-hidden="true"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm font-medium text-gray-500">
              @{data?.username}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <Badge
            border
            size="md"
            color="green"
            className="rounded-lg self-center"
          >
            {data?.role?.name}
          </Badge>
          {canEdit && (
            <Link
              to={editLink}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              Редактировать
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          {/* Description list*/}
          <section aria-labelledby="applicant-information-title">
            <div className="bg-white shadow sm:rounded-lg pb-4">
              <div className="px-4 py-5 sm:px-6">
                <h2
                  id="applicant-information-title"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Информация о сотруднике
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Подробная информация о сотруднике
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <UserDataItem
                    label="Специализация"
                    value={data?.Spec?.name}
                  />
                  <UserDataItem label="Email адрес" value={data?.email} />
                  <UserDataItem label="Телефон" value={data?.phone} />
                  <UserDataItem
                    label="Команды"
                    valueStyles="flex flex-wrap gap-2"
                    value={data?.teams?.map((t) => (
                      <SoftButton
                        size="xs"
                        to={`/teams/${t.teamId}`}
                        key={t.teamId}
                      >
                        {t.team.name}
                      </SoftButton>
                    ))}
                  />
                  {data?.teamCurator && data?.teamCurator?.length > 0 && (
                    <UserDataItem
                      className="sm:col-span-2"
                      label="Руководитель в командах"
                      valueStyles="flex flex-wrap gap-2"
                      value={data?.teamCurator?.map((t) => (
                        <SoftButton size="sm" to={`/teams/${t.id}`} key={t.id}>
                          {t.name}
                        </SoftButton>
                      ))}
                    />
                  )}
                  {data?.deputyRelationsAsUser?.length > 0 && (
                    <UserDataItem
                      className="sm:col-span-2"
                      label="Заместители пользователя"
                      valueStyles="flex flex-wrap gap-2"
                      value={data?.deputyRelationsAsUser?.map((t) => (
                        <UserDeputy
                          userId={data.id}
                          deputy={t.deputy}
                          key={t.deputy.id}
                          canEdit={canEdit}
                        />
                      ))}
                    />
                  )}
                  {data?.deputyRelationsAsDeputy?.length > 0 && (
                    <UserDataItem
                      className="sm:col-span-2"
                      label="Заместитель"
                      valueStyles="flex flex-wrap gap-2"
                      value={data?.deputyRelationsAsDeputy?.map((t) => (
                        <UserDeputyOf
                          deputyId={data.id}
                          user={t.user}
                          key={t.user.id}
                        />
                      ))}
                    />
                  )}
                </dl>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
