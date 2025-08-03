import MyRateCard from "@/features/MyRateCard";
import { useGetRatesMe } from "@/shared/hooks/rates";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import ShadowCard from "@/shared/ui/ShadowCard";

export default function MyMobileRates() {
  const { data, isPending } = useGetRatesMe();

  const shadowCards = new Array(2)
    .fill(0)
    .map((_, index) => (
      <ShadowCard className="min-h-[132px] animate-pulse" key={index} />
    ));

  return (
    <AnimationWrapper.Opacity>
      <div className="flex flex-col px-5 gap-3 font-extrabold">
        <h2 className="text-accent">Список ваших оценок 360</h2>
        {isPending && shadowCards}
        {!isPending &&
          data?.data.map((item) => <MyRateCard rate={item} key={item.id} />)}
      </div>
    </AnimationWrapper.Opacity>
  );
}
