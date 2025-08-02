import TabButtonsWithNotifications from "@/features/TabButtonsWithNotifications";
import type { TabButtonsWithNotificationsConfig } from "@/features/TabButtonsWithNotifications/types";
import type { TaskStatus } from "@/shared/types/Ipr";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import Divider from "@/shared/ui/Divider";
import { useSearchParams } from "react-router";
import MobileBoard from "./mobile-tabs/MobileBoard";
import MobilePlans from "./mobile-tabs/MobilePlans";
import { $api } from "@/shared/lib/$api";
import toast from "react-hot-toast";
import { queryKeys } from "@/shared/types/query-keys";
import { useQueryClient } from "@tanstack/react-query";

const tabs = ["board", "plans"] as const;

export default function PlansMobile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const current = searchParams.get("tab") ?? ("board" as (typeof tabs)[number]);
  const setTab = (tab: string) => setSearchParams({ tab });

  const config: Record<
    (typeof tabs)[number],
    TabButtonsWithNotificationsConfig
  > = {
    board: {
      label: "Задачи",
    },
    plans: {
      label: "Планы развития",
    },
  };

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
      <div className="p-5 font-extrabold pb-0">
        <h1 className="text-lg mb-3">Оценка 360</h1>
        <TabButtonsWithNotifications
          tabs={tabs}
          config={config}
          currentTab={current}
          onTabChange={setTab}
        />
      </div>
      <Divider />
      {current === "board" && <MobileBoard onChange={handleChange} />}
      {current === "plans" && <MobilePlans />}
    </AnimationWrapper.ScaleOpacity>
  );
}
