import type { Rate } from "@/shared/types/Rate";
import Badge from "@/shared/ui/Badge";
import StatItem from "@/shared/ui/StatItem";
import Crown from "@/shared/icons/Crown.svg";
import Divider from "@/shared/ui/Divider";
import EvaluatorsList from "./EvaluatorsList";
import Textarea from "@/shared/ui/Textarea";
import Button from "@/shared/ui/Button";
import type { ConfirmTab } from "../config";
import { useRef } from "react";
import AnimationWrapper from "@/shared/ui/AnimationWrapper";

interface ConfirmMainTabProps {
  rate: Rate;
  onCancel: () => void;
  evaluators: Rate["evaluators"];
  setEvaluators: React.Dispatch<React.SetStateAction<Rate["evaluators"]>>;
  onAdd: (tab: ConfirmTab) => void;
  onSubmit: (comment?: string) => void;
}

export default function ConfirmMainTab({
  rate,
  onCancel,
  evaluators,
  setEvaluators,
  onAdd,
  onSubmit,
}: ConfirmMainTabProps) {
  const teamEvaluators = evaluators.filter((e) => e.type === "TEAM_MEMBER");
  const subbordinateEvaluators = evaluators.filter(
    (e) => e.type === "SUBORDINATE",
  );
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const handleRemove = (id: number) => {
    setEvaluators((prev) => prev.filter((e) => e.userId !== id));
  };

  return (
    <AnimationWrapper.Opacity delay={0.05} exit={false}>
      <div className="flex flex-col font-extrabold">
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="Команда" value={rate.team?.name} />
          <StatItem label="Специализация" value={rate.spec?.name} />
          <StatItem
            label="Руководители"
            value={
              <div className="flex flex-wrap gap-1">
                {rate.evaluators
                  .filter((e) => e.type === "CURATOR")
                  .map((e) => (
                    <Badge className="h-6 pl-1 pr-2 gap-1" variant="secondary">
                      <Crown className="size-4" />
                      {e.user.username}
                    </Badge>
                  ))}
              </div>
            }
          />
          <StatItem
            label="Навыки"
            className="capitalize"
            value={rate.type.toLowerCase() + " Skills"}
          />
        </div>
        <Divider />
        <div className="flex flex-col gap-3">
          <EvaluatorsList
            evaluators={teamEvaluators}
            title="Коллеги"
            onRemove={handleRemove}
            onAdd={() => onAdd("team")}
          />
          <EvaluatorsList
            evaluators={subbordinateEvaluators}
            title="Подчиненные"
            onRemove={handleRemove}
            onAdd={() => onAdd("subbordinates")}
          />
        </div>
        <Divider />
        <Textarea
          ref={commentRef}
          label="Комментарий"
          placeholder="По желанию"
        />
        <Button
          className="mt-5"
          onClick={() => onSubmit(commentRef.current?.value)}
        >
          Утвердить список
        </Button>
        <Button
          variant="teritary"
          onClick={onCancel}
          className="mt-3 max-lg:hidden"
        >
          Отменить
        </Button>
      </div>
    </AnimationWrapper.Opacity>
  );
}
