import { rate360Api } from '@/shared/api/rate360Api';
import RateList from '../RatesList/RateList';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function AssignedRatesTab() {
  const { data, isLoading } = rate360Api.useAssignedRatesQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <RateList
        data={data}
        isLoading={isLoading}
        heading="По другим пользователям"
      />
    </LoadingOverlay>
  );
}
