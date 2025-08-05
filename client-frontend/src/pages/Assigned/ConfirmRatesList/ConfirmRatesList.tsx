import {
  useGetConfirmCuratorRates,
  useGetConfirmRates,
} from "@/shared/hooks/rates";
import { queryKeys } from "@/shared/types/query-keys";
import GridCardsListLayout from "@/features/GridCardsListLayout";
import ConfirmRate from "@/features/ConfirmRate";
import { cva } from "@/shared/lib/cva";

export default function ConfirmRatesList() {
  const { data: confirmRates, isLoading: confirmRatesLoading } =
    useGetConfirmRates();
  const { data: confirmCuratorRates, isLoading: confirmCuratorRatesLoading } =
    useGetConfirmCuratorRates();

  const loading = confirmRatesLoading || confirmCuratorRatesLoading;

  const isEmpty =
    confirmCuratorRates &&
    confirmCuratorRates.length === 0 &&
    confirmRates &&
    confirmRates.length === 0;

  return (
    <GridCardsListLayout
      loading={loading}
      titleClassName={cva("max-w-[676px] mb-5", {
        "mb-0": !!isEmpty,
      })}
      title="Утверждение взаимодействующих для оценки 360"
      description="Выберите тех, кто оценит ваши навыки"
      className=" py-6"
      isEmpty={isEmpty}
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
