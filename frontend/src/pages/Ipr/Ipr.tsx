import { IprEdit } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useParams } from 'react-router';

export default function Ipr() {
  const { rateId } = useParams<{ rateId: string }>();
  const { data, isFetching } = iprApi.useFindRateQuery(Number(rateId));

  // TODO: replace loading

  return (
    <LoadingOverlay active={isFetching}>
      <IprEdit ipr={data} />;
    </LoadingOverlay>
  );
}
