import { IprEdit } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { useParams } from 'react-router';

export default function Ipr() {
  const { rateId } = useParams<{ rateId: string }>();
  const { data, isFetching } = iprApi.useFindRateQuery(Number(rateId));

  console.log(rateId);

  return <IprEdit ipr={data} loading={isFetching} />
}
