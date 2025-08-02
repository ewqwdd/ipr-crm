import AssignedRate from "@/features/AssignedRate";
import { useGetAssignedRates, useGetSelfRates } from "@/shared/hooks/rates";
import { queryKeys } from "@/shared/types/query-keys";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import ShadowCard from "@/shared/ui/ShadowCard";

export default function AssignedMobileRates() {
  const { data: assigned, isPending: assignedPending } = useGetAssignedRates();
  const { data: self, isPending: selfPending } = useGetSelfRates();

  const isLoading = assignedPending || selfPending;

  const shadowCards = new Array(2)
    .fill(0)
    .map((_, index) => (
      <ShadowCard className="min-h-[132px] animate-pulse" key={index} />
    ));

  return (
    <AnimationWrapper.Opacity>
      <div className="flex flex-col px-5 gap-5 font-extrabold">
        <div className="flex flex-col gap-3">
          <h2 className="text-accent">Оценить себя</h2>
          {isLoading && shadowCards}
          {!isLoading &&
            self?.map((item) => (
              <AssignedRate
                queryKey={queryKeys.selfRates}
                rate={item}
                key={item.id}
              />
            ))}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-accent">Оценить других</h2>
          {isLoading && shadowCards}
          {!isLoading &&
            assigned?.map((item) => (
              <AssignedRate
                queryKey={queryKeys.assignedRates}
                rate={item}
                key={item.id}
              />
            ))}
        </div>
      </div>
    </AnimationWrapper.Opacity>
  );
}
