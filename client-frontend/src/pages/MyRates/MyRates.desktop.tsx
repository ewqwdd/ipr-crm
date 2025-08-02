import { useGetRatesMe } from "@/shared/hooks/rates";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import GridCardsListLayout from "@/features/GridCardsListLayout";
import MyRateCard from "@/features/MyRateCard";

export default function MyRatesDesktop() {
  const { data, isPending } = useGetRatesMe();

  return (
    <AnimationWrapper.ScaleOpacity>
      <GridCardsListLayout
        titleClassName="mb-5"
        loading={isPending}
        title="Командные отчёты"
        description="Список ваших оценок 360"
      >
        {data?.data.map((item) => <MyRateCard rate={item} key={item.id} />)}
      </GridCardsListLayout>
    </AnimationWrapper.ScaleOpacity>
  );
}
