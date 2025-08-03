import AnimationWrapper from "@/shared/ui/AnimationWrapper";
import { useSearchParams } from "react-router";

import Goal from "@/shared/icons/Goal.svg";
import Grade from "@/shared/icons/Grade.svg";
import Team from "@/shared/icons/Team.svg";
import Divider from "@/shared/ui/Divider";
import {
  useAssignedRatesCounter,
  useAssignedSelfRatesCounter,
  useConfirmRatesCounter,
} from "@/shared/hooks/ratesCounter";
import AssignedMobileRates from "./mobile-tabs/AssignedMobileRates";
import ConfirmMobileRates from "./mobile-tabs/ConfirmMobileRates";
import MyMobileRates from "./mobile-tabs/MyMobileRates";
import { AnimatePresence } from "framer-motion";
import type { TabButtonsWithNotificationsConfig } from "@/features/TabButtonsWithNotifications/types";
import TabButtonsWithNotifications from "@/features/TabButtonsWithNotifications";

const tabs = ["assigned", "my", "confirm"] as const;

export default function AssignedMobile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const current =
    searchParams.get("tab") ?? ("assigned" as (typeof tabs)[number]);
  const setTab = (tab: string) => setSearchParams({ tab });

  const assignedCount = useAssignedRatesCounter();
  const assignedSelfCount = useAssignedSelfRatesCounter();
  const confirmCount = useConfirmRatesCounter();

  const config: Record<
    (typeof tabs)[number],
    TabButtonsWithNotificationsConfig
  > = {
    assigned: {
      label: "Оценить",
      icon: <Goal className="size-4 min-w-4" />,
      notificationCount: assignedCount + assignedSelfCount,
    },
    my: {
      label: "Мои оценки",
      icon: <Grade className="size-4 min-w-4" />,
    },
    confirm: {
      label: "Выбрать оценивающих",
      icon: <Team className="size-4 min-w-4" />,
      notificationCount: confirmCount,
    },
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
      <AnimatePresence>
        {current === "assigned" && <AssignedMobileRates />}
        {current === "confirm" && <ConfirmMobileRates />}
        {current === "my" && <MyMobileRates />}
      </AnimatePresence>
    </AnimationWrapper.ScaleOpacity>
  );
}
