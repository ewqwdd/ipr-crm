import { rate360Api } from '@/shared/api/rate360Api';
import RateList from '../RatesList/RateList';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function SelfRateTab() {
  const { data, isLoading } = rate360Api.useSelfRatesQuery();

  return (
    <LoadingOverlay active={isLoading}>
      <RateList
        data={data}
        isLoading={isLoading}
        includeSelfRates
        heading="Самооценка 360"
      />
    </LoadingOverlay>
  );
}
