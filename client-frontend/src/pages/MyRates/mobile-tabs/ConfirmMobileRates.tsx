import ConfirmRate from "@/features/ConfirmRate";
import {
  useGetConfirmCuratorRates,
  useGetConfirmRates,
} from "@/shared/hooks/rates";
import { queryKeys } from "@/shared/types/query-keys";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import ShadowCard from "@/shared/ui/ShadowCard";

export default function ConfirmMobileRates() {
  const { data: confirmRates, isLoading: confirmRatesLoading } =
    useGetConfirmRates();
  const { data: confirmCuratorRates, isLoading: confirmCuratorRatesLoading } =
    useGetConfirmCuratorRates();

  const loading = confirmRatesLoading || confirmCuratorRatesLoading;
  const shadowCards = new Array(2)
    .fill(0)
    .map((_, index) => (
      <ShadowCard className="min-h-[132px] animate-pulse" key={index} />
    ));

  return (
    <AnimationWrapper.Opacity>
      <div className="flex flex-col px-5 gap-3 font-extrabold">
        <h2 className="text-accent">Утверждение списка для оценки 360</h2>
        {loading && shadowCards}
        {!loading &&
          confirmCuratorRates?.map((item) => (
            <ConfirmRate
              queryKey={queryKeys.confirmCuratorRates}
              rate={item}
              key={item.id}
            />
          ))}
        {!loading &&
          confirmRates?.map((item) => (
            <ConfirmRate
              queryKey={queryKeys.confirmRates}
              rate={item}
              key={item.id}
            />
          ))}
      </div>
    </AnimationWrapper.Opacity>
  );
}
