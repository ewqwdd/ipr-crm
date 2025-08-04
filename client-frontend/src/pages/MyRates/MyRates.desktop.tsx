import { useGetRatesMe } from "@/shared/hooks/rates";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import GridCardsListLayout from "@/features/GridCardsListLayout";
import MyRateCard from "@/features/MyRateCard";
import { cva } from "@/shared/lib/cva";

export default function MyRatesDesktop() {
  const { data, isPending, isRefetching } = useGetRatesMe();

  const isEmpty = data && data.data.length === 0;

  return (
    <AnimationWrapper.ScaleOpacity>
      <GridCardsListLayout
        titleClassName={cva({
          'mb-5': !isEmpty
        })}
        loading={isPending}
        title="Командные отчёты"
        description="Список ваших оценок 360"
        isEmpty={isEmpty}
      >
        {data?.data.map((item) => (
          <MyRateCard loading={isRefetching} rate={item} key={item.id} />
        ))}
      </GridCardsListLayout>
    </AnimationWrapper.ScaleOpacity>
  );
}
