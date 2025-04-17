import { useLoading } from '@/app/hooks/useLoading';
import { IprEdit } from '@/entities/ipr';
import { NotificationType } from '@/entities/notifications';
import { iprApi } from '@/shared/api/iprApi';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { useEffect } from 'react';
import { useParams } from 'react-router';

const notifTypes: NotificationType[] = ['IPR_ASSIGNED'];

export default function Ipr() {
  const { rateId } = useParams<{ rateId: string }>();
  const { data, isFetching } = iprApi.useFindRateQuery(Number(rateId));
  const { showLoading, hideLoading } = useLoading();
  useReadNotifsOnClose(notifTypes);

  useEffect(() => {
    if (isFetching) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isFetching, showLoading, hideLoading]);

  return <IprEdit ipr={data} />;
}
