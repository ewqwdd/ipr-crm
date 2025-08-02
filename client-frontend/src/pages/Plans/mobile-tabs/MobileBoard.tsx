import type { TaskStatus } from "@/shared/types/Ipr";
import TaskBoard from "@/widgets/TaskBoard";
import Card from "@/shared/ui/Card";
import { useGetUserBoard } from "@/shared/hooks/ipr";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";

interface Props {
  onChange: (id: number, status: TaskStatus) => void;
}

export default function MobileBoard({ onChange }: Props) {
  const { data, isPending, isRefetching } = useGetUserBoard();

  return (
    <AnimationWrapper.Opacity>
      {!isPending && !isRefetching && data && (
        <TaskBoard onChange={onChange} tasks={data ?? []} />
      )}
      {(isPending || isRefetching) && (
        <div className="flex flex-col px-5 mt-12">
          <Card className="h-44 animate-pulse" />
          <Card className="h-44 animate-pulse mt-5" />
          <Card className="h-44 animate-pulse mt-5" />
          <Card className="h-44 animate-pulse mt-5" />
        </div>
      )}
    </AnimationWrapper.Opacity>
  );
}
