import { rate360Api } from '@/shared/api/rate360Api';
import RateList from '../RatesList/RateList';

export default function SelfRateTab() {
  const { data, isLoading } = rate360Api.useSelfRatesQuery();

  return (
    <RateList data={data} isLoading={isLoading} heading="Самооценка 360" />
  );
}
