import { useGetIprMe } from "@/shared/hooks/ipr";
import ShadowCard from "@/shared/ui/ShadowCard";
import MyIprItem from "@/features/MyIprItem";

export default function IprList() {
  const { data, isPending } = useGetIprMe();

  return (
    <div className="flex flex-col gap-3">
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
  );
}
