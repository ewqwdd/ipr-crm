import { useAppSelector } from '@/app';
import {
  supportTicketNames,
  SupportTicketStatus,
  supportTicketStatuses,
} from '@/entities/support';
import { supportApi } from '@/shared/api/supportApi';
import { cva } from '@/shared/lib/cva';
import { displayName } from '@/shared/lib/displayName';
import { Card } from '@/shared/ui/Card';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SelectLight } from '@/shared/ui/SelectLight';
import { UserIcon } from '@heroicons/react/outline';
import { Link, useParams } from 'react-router';

export default function SupportOverview() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching } = supportApi.useGetTicketQuery(
    Number(id),
  );
  const [assignSelf, assignSelfState] =
    supportApi.useAssignSelfToTicketMutation();
  const [updateStatus, updateStatusSelf] =
    supportApi.useUpdateTicketStatusMutation();
  const user = useAppSelector((state) => state.user.user);

  const isCurator = data?.curator?.id === user?.id;

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      {data && (
        <div
          className={cva('px-4 py-6 sm:px-8 sm:py-10 flex flex-col', {
            'animate-pulse pointer-events-none':
              isFetching ||
              assignSelfState.isLoading ||
              updateStatusSelf.isLoading,
          })}
        >
          <div className="flex justify-between items-center">
            <Heading title={`Запрос в поддержку #${data?.id}`} />
            {!data.curator && (
              <PrimaryButton onClick={() => assignSelf({ id: data.id })}>
                Взять в работу
              </PrimaryButton>
            )}
          </div>

          <div className="flex gap-2 mt-8 text-sm items-center">
            <strong className="text-gray-700">Статус:</strong>
            {isCurator ? (
              <SelectLight
                onChange={(e) =>
                  updateStatus({
                    id: data.id,
                    status: e.target.value as SupportTicketStatus,
                  })
                }
                value={data?.status}
                className="w-40"
              >
                {supportTicketStatuses.map((s) => (
                  <option key={s} value={s}>
                    {supportTicketNames[s]}
                  </option>
                ))}
              </SelectLight>
            ) : (
              <span className="text-gray-700">
                {supportTicketNames[data?.status]}
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-8 text-sm">
            <strong className="text-gray-700">Куратор тикета:</strong>
            {data?.curator && (
              <Link
                to={`/users/${data?.curator.id}`}
                className="text-indigo-500 hover:text-indigo-700 transition-all"
              >
                {displayName(data.curator)}
              </Link>
            )}
          </div>

          <Card className="mt-5">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-500" />
              <Link
                to={`/users/${data?.user.id}`}
                className="text-indigo-500 hover:text-indigo-700 transition-all"
              >
                {data && displayName(data?.user)}
              </Link>
            </div>
            <h2 className="text-lg font-medium mt-4">{data?.title}</h2>
            <p className="text-gray-600 mt-2">{data?.description}</p>
          </Card>
        </div>
      )}
    </LoadingOverlay>
  );
}
