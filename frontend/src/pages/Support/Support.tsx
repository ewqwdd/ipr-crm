import { useModal } from '@/app/hooks/useModal';
import { SupportTicketSelf } from '@/entities/support';
import { supportApi } from '@/shared/api/supportApi';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Support() {
  const { data, isFetching, isError } = supportApi.useGetTicketsQuery();
  const { openModal } = useModal();

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка загрузки тикетов');
    }
  }, [isError]);

  useReadNotifsOnClose(['SUPPORT_TICKET_CREATED']);

  return (
    <LoadingOverlay active={isFetching} fullScereen>
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
        <div className="mt-3 flex flex-col gap-2 pt-4">
          {data?.map((ticket) => (
            <SupportTicketSelf key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </LoadingOverlay>
  );
}
