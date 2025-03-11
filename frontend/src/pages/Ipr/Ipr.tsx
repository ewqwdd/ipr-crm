import { useLoading } from '@/app/hooks/useLoading';
import { IprEdit } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function Ipr() {
  const { rateId } = useParams<{ rateId: string }>();
  const { data, isFetching } = iprApi.useFindRateQuery(Number(rateId));
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isFetching) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isFetching, showLoading, hideLoading]);

  return <IprEdit ipr={data} />;
}
