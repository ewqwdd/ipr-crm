import { useModal } from '@/app/hooks/useModal';
import {
  SupportTicket,
  supportTicketNames,
  SupportTicketStatus,
  supportTicketStatuses,
} from '@/entities/support';
import { supportApi } from '@/shared/api/supportApi';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Pagination } from '@/shared/ui/Pagination';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { Radio } from '@/shared/ui/Radio';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const LIMIT = 10;

export default function SupportAdmin() {
  const [status, setStatus] = useState<SupportTicketStatus>('OPEN');
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } =
    supportApi.useGetAdminTicketsQuery({ limit: LIMIT, page, status });
  const { openModal } = useModal();

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка загрузки тикетов');
    }
  }, [isError]);

  useReadNotifsOnClose(['SUPPORT_TICKET_CREATED']);

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col">
        <div className="flex justify-between items-center">
          <Heading title="Поддержка" description="Ваши запросы в поддержку" />
          <PrimaryButton
            className="self-start"
            onClick={() => openModal('CREATE_SUPPORT_TICKET')}
          >
            Добавить
          </PrimaryButton>
        </div>
        <div className="flex gap-8 mt-6">
          {supportTicketStatuses.map((s) => (
            <Radio key={s} checked={s === status} onChange={() => setStatus(s)}>
              {supportTicketNames[s]}
            </Radio>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 pt-3 flex-1">
          {!isFetching &&
            data?.data.map((ticket) => (
              <SupportTicket key={ticket.id} ticket={ticket} />
            ))}
        </div>
        {isFetching &&
          new Array(LIMIT)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-[68px] bg-white shadow-md rounded-lg mb-4 animate-pulse"
              />
            ))}
        {!!data?.total && (
          <Pagination
            limit={LIMIT}
            page={page}
            setPage={setPage}
            count={data?.total}
          />
        )}
      </div>
    </LoadingOverlay>
  );
}
