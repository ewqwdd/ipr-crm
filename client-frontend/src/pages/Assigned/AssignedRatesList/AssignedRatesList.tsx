import { useGetAssignedRates, useGetSelfRates } from "@/shared/hooks/rates";
import Card from "@/shared/ui/Card";
import Divider from "@/shared/ui/Divider";
import ShadowCard from "@/shared/ui/ShadowCard";
import Title from "@/shared/ui/Title";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import { queryKeys } from "@/shared/types/query-keys";
import AssignedRate from "@/features/AssignedRate";

export default function AssignedRatesList() {
  const { data: assigned, isLoading: assignedLoading } = useGetAssignedRates();
  const { data: assignedSelf, isLoading: assignedSelfLoading } =
    useGetSelfRates();

  return (
    <AnimationWrapper.Opacity delay={0.05}>
      <Card>
        <Title
          className="max-w-[676px]"
          title="Оценка 360"
          description="Доверьтесь интуиции. Если вы чувствуете, что всё делаете правильно и это сработает, если вы верите в это, то это обязательно произойдёт."
        />
        <Divider />

        {(assignedSelfLoading || (assignedSelf && assignedSelf.length > 0)) && (
          <h2 className="text-accent font-extrabold mb-3">Оценить себя</h2>
        )}
        <div className="grid grid-cols-2 gap-3">
          {!assignedSelfLoading &&
            assignedSelf?.map((item) => (
              <AssignedRate
                queryKey={queryKeys.selfRates}
                rate={item}
                key={item.id}
              />
            ))}
          {assignedSelfLoading &&
            new Array(2)
              .fill(0)
              .map((_, index) => (
                <ShadowCard
                  className="min-h-[132px] animate-pulse"
                  key={index}
                />
              ))}
        </div>

        {(assignedLoading || (assigned && assigned.length > 0)) && (
          <h2 className="text-accent font-extrabold my-3">Оценить других</h2>
        )}
        <div className="grid grid-cols-2 gap-3">
          {assignedLoading &&
            new Array(2)
              .fill(0)
              .map((_, index) => (
                <ShadowCard
                  className="min-h-[132px] animate-pulse"
                  key={index}
                />
              ))}
          {!assignedLoading &&
            assigned?.map((item) => (
              <AssignedRate
                queryKey={queryKeys.assignedRates}
                rate={item}
                key={item.id}
              />
            ))}
        </div>
      </Card>
    </AnimationWrapper.Opacity>
  );
}
