import { rate360Api } from '@/shared/api/rate360Api';
import RateList from '../RatesList/RateList';

export default function AssignedRatesTab() {
  const { data, isLoading } = rate360Api.useAssignedRatesQuery();
  return (
    <RateList
      data={data}
      isLoading={isLoading}
      heading="По другим пользователям"
    />
  );
}
