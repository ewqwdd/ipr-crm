import {
  useGetConfirmCuratorRates,
  useGetConfirmRates,
} from "@/shared/hooks/rates";
import { queryKeys } from "@/shared/types/query-keys";
import GridCardsListLayout from "@/features/GridCardsListLayout";
import ConfirmRate from "@/features/ConfirmRate";

export default function ConfirmRatesList() {
  const { data: confirmRates, isLoading: confirmRatesLoading } =
    useGetConfirmRates();
  const { data: confirmCuratorRates, isLoading: confirmCuratorRatesLoading } =
    useGetConfirmCuratorRates();

  const loading = confirmRatesLoading || confirmCuratorRatesLoading;

  return (
    <GridCardsListLayout
      loading={loading}
      titleClassName="max-w-[676px] mb-5"
      title="Утверждение взаимодействующих для оценки 360"
      description="Выберите тех, кто оценит ваши навыки"
    >
      {confirmCuratorRates?.map((item) => (
        <ConfirmRate
          queryKey={queryKeys.confirmCuratorRates}
          rate={item}
          key={item.id}
        />
      ))}
      {confirmRates?.map((item) => (
        <ConfirmRate
          queryKey={queryKeys.confirmRates}
          rate={item}
          key={item.id}
        />
      ))}
    </GridCardsListLayout>
  );
}
