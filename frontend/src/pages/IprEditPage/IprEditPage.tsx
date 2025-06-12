import { IprEdit } from '@/entities/ipr';
import { NotificationType } from '@/entities/notifications';
import { iprApi } from '@/shared/api/iprApi';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { useParams } from 'react-router';

const notifTypes: NotificationType[] = ['IPR_ASSIGNED'];

export default function IprEditPage() {
  const { rateId } = useParams<{ rateId: string }>();
  const { data, isFetching } = iprApi.useFindRateQuery(Number(rateId), {
    refetchOnMountOrArgChange: true,
  });
  useReadNotifsOnClose(notifTypes);

  return (
    <LoadingOverlay fullScereen active={isFetching}>
      <IprEdit ipr={data} />
    </LoadingOverlay>
  );
}
