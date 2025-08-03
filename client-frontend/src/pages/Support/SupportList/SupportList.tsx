import { useGetSupport } from "@/shared/hooks/support";
import { dateService } from "@/shared/lib/services/dateService";
import type { SupportTicketStatus } from "@/shared/types/Support";
import Badge from "@/shared/ui/Badge";
import ShadowCard from "@/shared/ui/ShadowCard";
import type { ReactNode } from "react";

import Clock from "@/shared/icons/Clock.svg";
import CheckboxCircle from "@/shared/icons/CheckedCircle.svg";

const statusConfig: Record<
  SupportTicketStatus,
  { label: string; icon?: ReactNode }
> = {
  OPEN: { label: "Открыт", icon: <Clock className="size-4" /> },
  CLOSED: { label: "Закрыт", icon: <CheckboxCircle className="size-4" /> },
  IN_PROGRESS: { label: "В ожидании", icon: <Clock className="size-4" /> },
};

export default function SupportList() {
  const { data: supportList, isLoading: supportListLoading } = useGetSupport();

  return (
    <div className="flex flex-col gap-2 font-extrabold">
      {supportListLoading &&
        new Array(2)
          .fill(null)
          .map((_, index) => <ShadowCard className="h-36" key={index} />)}
      {!supportListLoading &&
        supportList?.map((item) => (
          <ShadowCard key={item.id} className="flex flex-col">
            <h2 className="text-secondary tet-sm">
              {dateService.formatDateTime(item.createdAt)}
            </h2>
            <p className="mt-1">{item.title}</p>
            <Badge
              icon={statusConfig[item.status].icon}
              variant={item.status === "CLOSED" ? "success" : "secondary"}
              className="self-start mt-3"
            >
              {statusConfig[item.status].label}
            </Badge>
          </ShadowCard>
        ))}
    </div>
  );
}
