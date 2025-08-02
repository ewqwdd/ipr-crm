import SoftButton from "@/shared/ui/SoftButton";
import NotificationWrapper from "@/shared/ui/NotificationWrapper";
import type { TabButtonsWithNotificationsConfig } from "./types";
import { cva } from "@/shared/lib/cva";

interface TabsWithNotificationsProps {
  tabs: readonly string[];
  config: Record<string, TabButtonsWithNotificationsConfig>;
  currentTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export default function TabButtonsWithNotifications({
  tabs,
  config,
  currentTab,
  onTabChange,
  className,
}: TabsWithNotificationsProps) {
  return (
    <div className={cva("flex gap-2.5 flex-wrap", className)}>
      {tabs.map((tab) => (
        <NotificationWrapper key={tab} value={config[tab]?.notificationCount}>
          <SoftButton
            onClick={() => onTabChange(tab)}
            variant={tab === currentTab ? "primary" : "teritary"}
          >
            {config[tab]?.icon}
            {config[tab]?.label}
          </SoftButton>
        </NotificationWrapper>
      ))}
    </div>
  );
}
