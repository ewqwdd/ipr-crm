import { statusNames, type TaskStatus } from "@/shared/types/Ipr";
import type { BadgeVariant } from "@/shared/ui/Badge";
import Badge from "@/shared/ui/Badge";
import { memo } from "react";

interface TaskStatusBadgeProps {
  taskStatus: TaskStatus;
}

export default memo(function TaskStatusBadge({
  taskStatus,
}: TaskStatusBadgeProps) {
  let status: BadgeVariant;
  switch (taskStatus) {
    case "TO_DO":
      status = "teritary";
      break;
    case "IN_PROGRESS":
      status = "secondary";
      break;
    case "COMPLETED":
      status = "success";
      break;
    case "IN_REVIEW":
      status = "primary";
  }

  return <Badge variant={status}>{statusNames[taskStatus]}</Badge>;
});
