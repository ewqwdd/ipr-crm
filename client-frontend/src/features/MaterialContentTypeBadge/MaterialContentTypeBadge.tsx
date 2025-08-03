import { materialTypes, type Material } from "@/shared/types/Material";
import Badge, { type BadgeVariant } from "@/shared/ui/Badge";

interface MaterialContentTypeBadgeProps {
  type: Material["contentType"];
  className?: string;
}

export default function MaterialContentTypeBadge({
  type,
  className,
}: MaterialContentTypeBadgeProps) {
  let variant: BadgeVariant;
  switch (type) {
    case "VIDEO":
      variant = "error-light";
      break;
    case "COURSE":
      variant = "primary-light";
      break;
    case "BOOK":
      variant = "warning-light";
      break;
    case "TASK":
      variant = "success-light";
      break;
    default:
      variant = "primary-light";
      break;
  }

  return (
    <Badge className={className} variant={variant}>
      {materialTypes[type]}
    </Badge>
  );
}
