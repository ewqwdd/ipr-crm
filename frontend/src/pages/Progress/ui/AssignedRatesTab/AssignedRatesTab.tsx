import { rate360Api } from '@/shared/api/rate360Api';
import RateList from '../RatesList/RateList';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function AssignedRatesTab() {
  const { data, isLoading, isFetching } = rate360Api.useAssignedRatesQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <RateList
        includeSelfTeam
        data={data}
        isLoading={isFetching}
        heading="По другим пользователям"
      />
    </LoadingOverlay>
  );
}
