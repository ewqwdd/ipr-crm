import { IprEdit } from '@/entities/ipr';
import { NotificationType } from '@/entities/notifications';
import { iprApi } from '@/shared/api/iprApi';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { useParams } from 'react-router';

const notifTypes: NotificationType[] = ['IPR_ASSIGNED'];

export default function Ipr() {
  const { rateId } = useParams<{ rateId: string }>();
  const { data, isFetching } = iprApi.useFindRateQuery(Number(rateId));
  useReadNotifsOnClose(notifTypes);

  return (
    <LoadingOverlay active={isFetching}>
      <IprEdit ipr={data} />
    </LoadingOverlay>
  );
}
