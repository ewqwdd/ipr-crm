import MyIprItem from "@/features/MyIprItem";
import { useGetIprMe } from "@/shared/hooks/ipr";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import ShadowCard from "@/shared/ui/ShadowCard";

export default function MobilePlans() {
  const { data, isPending } = useGetIprMe();

  return (
    <AnimationWrapper.Opacity>
      <div className="flex flex-col px-5 gap-3 font-extrabold">
        <h2 className="text-accent">Планы развития</h2>
        {isPending &&
          new Array(3)
            .fill(0)
            .map((_, index) => (
              <ShadowCard className="h-[132px] animate-pulse" key={index} />
            ))}
        {!isPending &&
          data &&
          data.map((item) => <MyIprItem key={item.id} ipr={item} />)}
      </div>
    </AnimationWrapper.Opacity>
  );
}
