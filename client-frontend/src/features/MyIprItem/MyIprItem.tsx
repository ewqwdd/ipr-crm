import { cva } from "@/shared/lib/cva";
import { iprService } from "@/shared/lib/services/iprService";
import type { Ipr } from "@/shared/types/Ipr";
import Badge from "@/shared/ui/Badge";
import ShadowCard from "@/shared/ui/ShadowCard";
import SoftButton from "@/shared/ui/SoftButton";
import { useNavigate } from "react-router";

interface MyIprItemProps {
  ipr: Ipr;
}

export default function MyIprItem({ ipr }: MyIprItemProps) {
  const progress = iprService.getPlanProgress(ipr);
  const isCompleted = progress >= 100;
  const navigate = useNavigate();

  return (
    <ShadowCard>
      <div className="flex items-center gap-2">
        <span className="text-secondary text-sm">{ipr.rate360.team?.name}</span>
        <Badge className="capitalize ml-auto" variant="secondary">
          {ipr.rate360.type.toLowerCase()} skills
        </Badge>
      </div>
      <h2>{ipr.rate360.spec.name}</h2>
      <div className="flex justify-between mt-3 items-center">
        <SoftButton
          onClick={() => navigate(`/plans/${ipr.id}`)}
          variant={isCompleted ? "teritary" : "primary"}
          disabled={isCompleted}
        >
          {isCompleted ? "Завершено" : "Перейти"}
        </SoftButton>
        <span
          className={cva("text-error", {
            "text-success": progress >= 75,
            "text-warning": progress < 75 && progress >= 25,
          })}
        >
          {progress}%
        </span>
      </div>
    </ShadowCard>
  );
}
