import { $api } from "@/shared/lib/$api";
import type { TaskStatus } from "@/shared/types/Ipr";
import { queryKeys } from "@/shared/types/query-keys";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TaskBoard from "@/widgets/TaskBoard";
import { useGetUserBoard } from "@/shared/hooks/ipr";
import Card from "@/shared/ui/Card";
import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import { Navigate } from "react-router";

export default function Board() {
  const { data, isPending } = useGetUserBoard();

  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  if (isMobile) return <Navigate to="/plans?tab=board" />;

  const handleChange = (id: number, status: TaskStatus) => {
    $api
      .post("/ipr/task/status", {
        id,
        status,
        self: true,
      })
      .catch((err) => {
        console.error(err);
        toast.error("Ошибка обновления статуса задания");
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.iprMe],
        });
      });
  };

  return (
    <AnimationWrapper.ScaleOpacity>
      {!isPending && data && (
        <TaskBoard onChange={handleChange} tasks={data ?? []} />
      )}
      {isPending && (
        <>
          <Card className="h-44 animate-pulse" />
          <Card className="h-44 animate-pulse mt-5" />
          <Card className="h-44 animate-pulse mt-5" />
          <Card className="h-44 animate-pulse mt-5" />
        </>
      )}
    </AnimationWrapper.ScaleOpacity>
  );
}
