import { rate360Api } from '@/shared/api/rate360Api';
import RateList from '../RatesList/RateList';
import { useLoading } from '@/app/hooks/useLoading';
import { useEffect } from 'react';

export default function SelfRateTab() {
  const { data, isLoading } = rate360Api.useSelfRatesQuery();

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  return (
    <RateList data={data} isLoading={isLoading} heading="Самооценка 360" />
  );
}
