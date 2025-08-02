import { priorityNames, type TaskPriority } from "@/shared/types/Ipr";
import type { BadgeVariant } from "@/shared/ui/Badge";
import Badge from "@/shared/ui/Badge";
import { memo } from "react";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export default memo(function PriorityBadge({ priority }: PriorityBadgeProps) {
  let variant: BadgeVariant;
  switch (priority) {
    case "HIGH":
      variant = "error-alt";
      break;
    case "MEDIUM":
      variant = "warning-alt";
      break;
    case "LOW":
      variant = "success-alt";
      break;
  }

  return <Badge variant={variant}>{priorityNames[priority]}</Badge>;
});
